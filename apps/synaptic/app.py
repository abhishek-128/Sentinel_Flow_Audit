from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import synaptic_engine
import json
import os

# Initialize NLP pipeline globally to avoid reloading per request
try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Warning: spaCy model 'en_core_web_sm' is not installed.")
    nlp = None

app = FastAPI(title="Synaptic Compression API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_shared_schema_path():
    # Helper to resolve where the shared schema logic_map.json lives
    # Assuming /packages is mapped or physically present relative to app
    current_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.normpath(os.path.join(current_dir, "..", "..", "packages", "shared", "schemas", "logic_map.json"))

@app.post("/distill")
async def distill_document(file: UploadFile = File(...)):
    """
    Ingests a PDF, extracts text via PyMuPDF, and distills nodes via C++ Engine.
    Emits a Logic Map JSON format for Sentinel to consume.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    if not nlp:
        raise HTTPException(status_code=500, detail="spaCy model 'en_core_web_sm' is not loaded on server.")

    try:
        pdf_bytes = await file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        # Initialize C++ engine
        distiller = synaptic_engine.SatisfiabilityDistiller()
            
        full_text = ""
        # Limit to 5 pages max to prevent demo freezing from overwhelming O(N^2) CDCL logic
        pages_to_process = min(5, doc.page_count)
        for p_num in range(pages_to_process):
            full_text += doc[p_num].get_text("text") + " "
            
        # NLP Tokenization into semantic sentences (propositions)
        # Limit tokenization length to avoid max_length errors
        d = nlp(full_text[:500000]) 
        for sent in d.sents:
            text_str = sent.text.strip()
            # Basic sanity check to avoid parsing solitary punctuation/numbers as rules
            if len(text_str) > 5:
                distiller.add_proposition(text_str)
                    
        # Distill logical redundancies
        distilled_propositions = distiller.distill()
        
        # Format the logic map for React Flow consumption
        logic_map = {
            "sourceFile": file.filename,
            "distillationEventId": "EVT-12345", # Placeholder ID
            "nodes": [
                {"id": f"node_{i}", "proposition": prop} for i, prop in enumerate(distilled_propositions)
            ]
        }
        
        # Output log file for Sentinel auditor
        log_dir = "/tmp/synaptic_logs"
        os.makedirs(log_dir, exist_ok=True)
        log_path = os.path.join(log_dir, f"distilled_{file.filename}.json")
        with open(log_path, "w") as f:
            json.dump(logic_map, f, indent=2)

        return {"status": "success", "event_id": logic_map["distillationEventId"], "nodes": logic_map["nodes"]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

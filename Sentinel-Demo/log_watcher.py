import time
import os
import sys
import warnings

# Suppress warnings
warnings.filterwarnings("ignore", category=FutureWarning)

import google.generativeai as genai
from dotenv import load_dotenv

# --- CONFIGURATION ---
# Robust path resolution: Always find files relative to THIS script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(SCRIPT_DIR, "activity.log")
LOCKDOWN_FILE = os.path.join(SCRIPT_DIR, "LOCKDOWN.md")
ENV_PATH = os.path.join(SCRIPT_DIR, "..", ".env.local")

# Load environment variables
print(f"Loading environment from: {ENV_PATH}")
load_dotenv(dotenv_path=ENV_PATH)

API_KEY = os.getenv("VITE_GEMINI_API_KEY")
if not API_KEY:
    print("CRITICAL ERROR: VITE_GEMINI_API_KEY not found in .env.local")
    print("Please ensure the .env.local file exists and contains the key.")
    time.sleep(5) # Give user time to read
    sys.exit(1)

genai.configure(api_key=API_KEY)

# Use a model that supports generation
MODEL_NAME = "gemini-3-pro-preview" 

def get_model():
    """Returns a model instance, handles potential init errors gracefully."""
    try:
        return genai.GenerativeModel(MODEL_NAME)
    except Exception as e:
        print(f"Error initializing model: {e}")
        return None

model = get_model()

def check_log_line(line):
    """Checks a log line for PII or medical data using Gemini."""
    if not model:
        return "ERROR: Model not initialized"

    prompt = f"""
    Analyze the following log line for Personally Identifiable Information (PII) 
    (specifically home addresses) or medical conditions.
    
    Log line: "{line.strip()}"
    
    If the log line contains a home address OR medical condition, respond with "VIOLATION: <brief explanation>".
    Otherwise, respond with "SAFE".
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        return text
    except Exception as e:
        print(f"API Error during check: {e}")
        return "API_ERROR"

def trigger_lockdown(violation_details):
    """Creates a LOCKDOWN.md file and exits."""
    content = f"""# CRITICAL_VIOLATION

Sentinel has detected a privacy violation and initiated a lockdown.

## Violation Details
{violation_details}

## Action Taken
Log watcher stopped. Manual intervention required.
"""
    try:
        with open(LOCKDOWN_FILE, "w", encoding='utf-8') as f:
            f.write(content)
        print(f"\n!!! LOCKDOWN INITIATED !!!\n{violation_details}")
        sys.exit(0) # Stop the script
    except Exception as e:
        print(f"CRITICAL: Failed to write lockdown file: {e}")

def watch_log(logfile):
    print(f"\nSentinel Log Watcher started.")
    print(f"Monitoring: {logfile}")
    print(f"Model: {MODEL_NAME}")
    print("--------------------------------------------------")
    
    # Ensure log file exists
    if not os.path.exists(logfile):
        print(f"Log file not found. Creating empty file: {logfile}")
        with open(logfile, 'w') as f: pass

    try:
        # Open file with robust encoding handling
        # encoding='utf-8' with errors='replace' handles most text
        # If specific encoding issues arise, we can try opening with 'latin-1' as fallback
        with open(logfile, 'r', encoding='utf-8', errors='replace') as f:
            # Go to the end of the file
            f.seek(0, 2)
            
            while True:
                line = f.readline()
                if not line:
                    time.sleep(0.5) # Wait for new data
                    continue
                
                line = line.strip()
                if not line: continue # Skip empty lines

                print(f"Processing: {line}", flush=True)
                result = check_log_line(line)
                
                if result.startswith("VIOLATION"):
                    trigger_lockdown(result)
                elif result == "SAFE":
                    print("Status: SAFE", flush=True)
                elif result == "API_ERROR":
                    print("Status: API Error (Skipping line)", flush=True)
                else:
                    print(f"Status: {result}", flush=True)

    except FileNotFoundError:
        print(f"Error: {logfile} disappeared!", flush=True)
    except Exception as e:
        print(f"Unexpected Error: {e}", flush=True)
        print("Restarting watcher in 5 seconds...")
        time.sleep(5)
        watch_log(logfile) # Retry recursion

if __name__ == "__main__":
    try:
        watch_log(LOG_FILE)
    except KeyboardInterrupt:
        print("\nWatcher stopped by user.")

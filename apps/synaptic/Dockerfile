# Stage 1: Build the C++ extension
FROM python:3.12-slim as builder

# Install build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir pybind11

COPY engine /build/engine

# Build the C++ module
RUN mkdir engine/build && cd engine/build && \
    cmake .. && \
    make

# Stage 2: Final runtime container
FROM python:3.12-slim

WORKDIR /app

# PyMuPDF dependencies might be required depending on base image,
# but the wheel usually bundles them.
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Python app
COPY app.py /app/

# Download spaCy NLP model
RUN python -m spacy download en_core_web_sm

# Copy the compiled .so extension from builder
# We'll copy to the same directory as app.py for easy imports.
COPY --from=builder /build/engine/build/*.so /app/

EXPOSE 8001

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]

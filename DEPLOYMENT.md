# Deployment Guide — Google Cloud Run

This guide outlines steps to package, build, and deploy **StadiumOS AI** to Google Cloud Run.

## Service Parameters

- **Service Name**: `stadiumos-ai`
- **Region**: `asia-south1` (Mumbai)
- **Deployment Type**: Container-based
- **Exposed Port**: `8080` (configured via `PORT` environment variable)
- **CPU Limits**: `1`
- **Memory Limits**: `512MiB`
- **Instances Limits**: Minimum `0`, Maximum `3`
- **Request Timeout**: `300s`
- **Startup CPU Boost**: Enabled

---

## Deployment Steps

### 1. Build and Run Container Locally
To test the Docker configuration locally:

```bash
# Build the production docker image
docker build -t stadiumos-ai .

# Run the container locally on port 8080, passing the Gemini API Key
docker run -p 8080:8080 -e VITE_GEMINI_API_KEY="your_api_key_here" stadiumos-ai
```
Visit `http://localhost:8080` to verify the client successfully loads and fetches the API key dynamically from `/api/config`.

---

### 2. Deploying to Google Cloud Run

#### Step A: Authenticate and Configure Google Cloud SDK
Ensure your `gcloud` CLI is installed and authenticated:

```bash
# Log in to your GCP account
gcloud auth login

# Set your active GCP project ID
gcloud config set project YOUR_GCP_PROJECT_ID
```

#### Step B: Build and Push Container to Google Artifact Registry
Create a repository in Artifact Registry and build the container image:

```bash
# Create repository in Artifact Registry (if it does not exist)
gcloud artifacts repositories create stadiumos-repo \
    --repository-format=docker \
    --location=asia-south1

# Tag your local image (or build directly using Cloud Build)
gcloud builds submit --tag asia-south1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/stadiumos-repo/stadiumos-ai:latest .
```

#### Step C: Deploy to Google Cloud Run
Deploy the container to Cloud Run, specifying region, hardware allocations, and the dynamic environment variable:

```bash
gcloud run deploy stadiumos-ai \
    --image=asia-south1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/stadiumos-repo/stadiumos-ai:latest \
    --region=asia-south1 \
    --platform=managed \
    --cpu=1 \
    --memory=512MiB \
    --min-instances=0 \
    --max-instances=3 \
    --timeout=300 \
    --cpu-boost \
    --set-env-vars=VITE_GEMINI_API_KEY="your_actual_gemini_api_key" \
    --allow-unauthenticated
```

---

## Security Auditing Note
- The Docker image **does not** contain any API keys or credentials.
- The `VITE_GEMINI_API_KEY` is loaded dynamically from the hosting platform's container environment variables at runtime, keeping all image layers clean and secure.

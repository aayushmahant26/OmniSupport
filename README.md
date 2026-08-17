# OmniSupport AI - Policy RAG Support Agent

OmniSupport AI is a Retrieval-Augmented Generation (RAG) customer support platform. It allows businesses to upload policy documents (PDFs and text files), automatically parses and segments them into semantic vector chunks, and indexes them in a local FAISS database. Customers can then chat in real-time with a custom-trained AI support bot or compare policies across multiple companies side-by-side.

---

## 🚀 Key Features

*   **Company Analytics Workspace**: Business users can view key performance indicators, check customer satisfaction ratings, identify knowledge gaps, and generate AI-driven executive support reports.
*   **Knowledge Base Manager**: Admin panel to upload policy documents, auto-extract text page-by-page via PyMuPDF (`fitz`), and segment text into overlapping chunks.
*   **FAISS Vector Storage**: Text chunks are embedded using Hugging Face's `all-MiniLM-L6-v2` transformer model (384-dimensional space) and indexed locally for high-speed Euclidean distance matching.
*   **Real-time AI Chat**: Conversation flow powered by a local Ollama instance (`phi3:latest`) or cloud-based Groq APIs with automatic topic classification.
*   **Feedback Loops & Gap Analysis**: Customers can rate responses as helpful/unhelpful. If a query is unhelpful due to missing knowledge, the AI generates a gap summary to tell the administrator what policies to upload next.
*   **Premium Interactive UI**: Modern, glassmorphic layout supporting dark mode toggle, detailed log modals, and zoomable logo overlay portals.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TailwindCSS, Lucide Icons, Axios.
*   **Backend**: Django, Django Rest Framework (DRF), SQLite.
*   **Vector Database & NLP**: FAISS (Facebook AI Similarity Search), PyMuPDF (PyMuPDF), SentenceTransformers (`all-MiniLM-L6-v2`).
*   **LLM Pipeline**: Ollama (`phi3:latest`), Groq API Client (`llama-3.3-70b-versatile`).

---

## 💻 Getting Started

### Prerequisites
*   Python 3.10+
*   Node.js 18+
*   Ollama (running locally)

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # macOS/Linux:
    source venv/bin/activate
    ```
3.  Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run database migrations:
    ```bash
    python manage.py migrate
    ```
5.  Start the local development server:
    ```bash
    python manage.py runserver
    ```

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install package dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite dev server:
    ```bash
    npm run dev
    ```

### 3. LLM Setup (Ollama)
Ensure your local Ollama server is running and download the default model:
```bash
ollama pull phi3:latest
ollama run phi3:latest
```

---

## 📁 Repository Structure

```
├── backend/
│   ├── apps/
│   │   ├── accounts/    # User authentication & role management
│   │   ├── companies/   # Business profiles & analytics report views
│   │   ├── documents/   # File uploads & document indexing
│   │   ├── chat/        # Dialogue sessions, history logs, and feedback loops
│   │   └── rag/         # Embeddings generation, FAISS service, & Ollama pipeline
│   ├── config/          # Django core settings & routing
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios client wrappers
│   │   ├── components/  # Shared layouts & theme togglers
│   │   ├── pages/       # Dashboard, chat pages, and comparative desks
│   │   └── index.css    # HSL design token stylesheets
│   └── index.html
└── .gitignore
```

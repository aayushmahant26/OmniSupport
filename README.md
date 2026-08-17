# OmniSupport
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

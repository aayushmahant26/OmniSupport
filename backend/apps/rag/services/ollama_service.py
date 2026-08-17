import os
import requests
import logging

logger = logging.getLogger(__name__)


class OllamaService:

    OLLAMA_MODEL = "phi3:latest"
    OLLAMA_URL = "http://localhost:11434/api/generate"

    @classmethod
    def _generate_response(cls, prompt):
        # Check if Groq API key is defined in the environment
        groq_api_key = os.environ.get("GROQ_API_KEY")
        if groq_api_key and groq_api_key.strip():
            groq_model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile").strip()
            try:
                print(f"--- [LLM] Generating response using Groq API ({groq_model}) ---")
                logger.info(f"Generating response using Groq API ({groq_model})")
                headers = {
                    "Authorization": f"Bearer {groq_api_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": groq_model,
                    "messages": [
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.2
                }
                # Call Groq's OpenAI-compatible Chat Completions API
                response = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers=headers,
                    json=payload,
                    timeout=15
                )
                response.raise_for_status()
                data = response.json()
                print("--- [LLM] Groq API response generation successful ---")
                return data["choices"][0]["message"]["content"]
            except Exception as e:
                logger.error(f"Groq API generation failed: {e}. Falling back to Ollama.")
                print(f"!!! [LLM] ERROR: Groq API failed ({e}). Falling back to local Ollama... !!!")

        # Fallback to local Ollama instance
        try:
            print(f"--- [LLM] Generating response using local Ollama ({cls.OLLAMA_MODEL}) ---")
            logger.info(f"Generating response using local Ollama ({cls.OLLAMA_MODEL})")
            response = requests.post(
                cls.OLLAMA_URL,
                json={
                    "model": cls.OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            print("--- [LLM] Ollama response generation successful ---")
            return data["response"]
        except Exception as e:
            err_msg = f"Ollama generation failed: {e}"
            logger.error(err_msg)
            print(f"!!! [LLM] ERROR: Ollama generation failed: {e} !!!")
            raise e

    @classmethod
    def generate_answer(
        cls,
        question,
        context
    ):
        prompt = f"""
You are an AI customer support assistant.

Answer the user's question ONLY using the provided context.

Structure your response to be clean, readable, and compact:
- Break down your answer into paragraphs or bullet points where appropriate.
- Leave at most a single empty line between paragraphs. Do NOT use multiple blank lines.
- Do NOT use markdown bold formatting like asterisks (**) anywhere.
- Do NOT use markdown headers (like #, ##, ###) in the text.
- Be clear and direct.

Do NOT say:
"I could not find that information"

unless the context is completely unrelated.

Context:
{context}

Question:
{question}

Answer:
"""
        return cls._generate_response(prompt)

    @classmethod
    def generate_comparison(
        cls,
        question,
        context
    ):
        prompt = f"""
You are an AI customer support assistant specializing in comparative policy analysis.

Analyze the provided contexts and synthesize a comparison to answer the user's question.

Your response must be clean, structured, and easy to scan:
- Present the comparison using bullet points, lists, or clear paragraphs.
- Compare the companies side-by-side or point-by-point.
- Use a single empty line between paragraphs. Do NOT use multiple consecutive blank lines.
- Do NOT use markdown bold formatting like asterisks (**) anywhere.
- Do NOT use markdown headers (like #, ##, ###) in the text.
- Keep the spacing compact and clean.

Contexts:
{context}

Question:
{question}

Answer:
"""
        return cls._generate_response(prompt)

    @classmethod
    def classify_topic(cls, question):
        categories = [
            "Returns & Refunds",
            "Order Cancellations",
            "Payments & Billing",
            "Shipping & Delivery",
            "Account & Tech Support",
            "Product Information",
            "General Information"
        ]
        categories_str = ", ".join([f'"{c}"' for c in categories])
        
        prompt = f"""You are an AI support classifier.
Classify the following customer question into exactly one of these categories:
{categories_str}
If it does not fit any of the above, classify it as "General Query".

Your response MUST be just the category name and nothing else. No punctuation, quotes, or bolding.

Question: {question}

Category:"""
        try:
            topic = cls._generate_response(prompt)
            if not topic:
                return "General Query"
            topic = topic.strip().replace('"', '').replace("'", "").replace("*", "")
            # Validate output matches or contains a category
            for cat in categories:
                if cat.lower() in topic.lower() or topic.lower() in cat.lower():
                    return cat
            return "General Query"
        except Exception as e:
            logger.error(f"Failed to classify topic: {e}")
            return "General Query"

    @classmethod
    def summarize_missing_data(cls, question):

        # this creates a prompt for the model to summarize the missing data in the knowledge base based on the customer support question
        prompt = f"""Identify what information is missing from the knowledge base based on the following customer support question.
Summarize it in 1 short sentence (at most 10-12 words).
Example: "Standard shipping refund duration" or "Holiday customer support hours".
Do not use bolding or punctuation.

Question: {question} 

Missing Data Summary:""" 
        try:
            # if llm fails to generate the summary, it will save first 80 characters instead of storing nothing.
            summary = cls._generate_response(prompt)
            if not summary:
                return question[:80] + "..."
            summary = summary.strip().replace('"', '').replace("'", "").replace("*", "")
            return summary[:150]
        except Exception as e:
            logger.error(f"Failed to summarize missing data: {e}")
            return question[:80] + "..."

    @classmethod
    def generate_analytics_report(
        cls,
        company_name,
        total_questions,
        satisfaction_score,
        helpful_responses,
        unhelpful_responses,
        missing_data,
        unhelpful_text
    ):
        prompt = f"""
You are an expert customer experience analyst and knowledge base optimizer.
Analyze the following customer support metrics and unhelpful bot replies for {company_name}.
Write a highly professional, detailed executive summary report in Markdown.

Metrics:
- Total questions asked by customers: {total_questions}
- Customer satisfaction score: {satisfaction_score:.1f}% ({helpful_responses} helpful rating, {unhelpful_responses} unhelpful rating)
- Flagged knowledge gaps in database: {missing_data}

Recent Unhelpful Interactions:
{unhelpful_text if unhelpful_text else "No recent unhelpful interactions recorded. Customers are generally satisfied."}

Provide a comprehensive analysis split into the following sections:
1. Executive Summary: High-level overview of query volumes, general satisfaction, and system health.
2. Satisfaction Score Breakdown: Analyze the rating distribution and explain what they indicate.
3. Identified Knowledge Gaps: Highlight specific topics or questions that the chatbot failed to resolve because information was missing from the knowledge base.
4. Actionable KB Recommendations: Formulate concrete, detailed recommendations of what policies, FAQs, or documents should be uploaded or created to resolve these gaps and improve the assistant's performance.

Do not use double asterisks (**) for bolding, use plain text or standard formatting without bolding. Maintain a constructive, strategic, and professional tone.
"""
        return cls._generate_response(prompt)



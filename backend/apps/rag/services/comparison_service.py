# pyrefly: ignore [missing-import]
from apps.companies.models import Company 

from .retrieval_service import (
    RetrievalService
)

class ComparisonService:

    @staticmethod
    def build_comparison_context(
        company_ids,
        question
    ):

        context = ""

        companies = (
            Company.objects.filter(
                id__in=company_ids
            )
        )

        for company in companies:

            chunks = (
                RetrievalService
                .retrieve_chunks(
                    company.id,
                    question,
                    top_k=2
                )
            )

            company_context = (
                RetrievalService
                .build_context(
                    chunks
                )
            )

            context += f"""

Company:
{company.name}

Information:
{company_context}

"""
        return context
    
    
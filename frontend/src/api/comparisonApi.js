import axiosClient from '../services/axiosClient';

export const comparisonApi = {

  // This method is used to compare the knowledge base of multiple companies.
  // This method is invoked when the user wants to compare the policies of multiple companies.
  // It first builds the context for the comparison by retrieving the knowledge base of the selected companies.
  // Then it generates the comparison answer using the LLM.
  // Finally it returns the comparison answer and the session details.
  compareCompanies: async (companyIds, question) => {
    const response = await axiosClient.post('/api/rag/compare/', {
      company_ids: companyIds,
      question,
    });
    return response.data;
  },
};

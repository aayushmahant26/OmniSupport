import axiosClient from '../services/axiosClient';

export const chatApi = {

  // This function creates a new chat session for a pirticular company
  createSession: async (companyId) => {
    const response = await axiosClient.post(`/api/chat/session/${companyId}/`);
    return response.data;
  },

  // Gets the details/messages of a particular chat session.
  getSessionDetail: async (sessionId) => {
    const response = await axiosClient.get(`/api/chat/session-detail/${sessionId}/`);
    return response.data;
  },

  // This is used to get all chat sessions belonging to the current user.
  listSessions: async () => {
    const response = await axiosClient.get('/api/chat/sessions/');
    return response.data;
  },

  // This is used to Delete a chat session.
  deleteSession: async (sessionId) => {
    const response = await axiosClient.delete(`/api/chat/session-delete/${sessionId}/`);
    return response.data;
  },

  // This is used to send a chat message to the LLM.
  // This is the function which activates the RAG pipeline and returns the response from the LLM.
  sendChatMessage: async (companyId, sessionId, question) => {
    const response = await axiosClient.post(`/api/rag/chat/${companyId}/${sessionId}/`, {
      question,
    });
    return response.data;
  },

  // This is used to submit feedback for a chat message.
  submitFeedback: async (messageId, feedback, feedbackMissingData = false) => {
    const response = await axiosClient.post(`/api/chat/message/${messageId}/feedback/`, {
      feedback,
      feedback_missing_data: feedbackMissingData,
    });
    return response.data;
  },
};

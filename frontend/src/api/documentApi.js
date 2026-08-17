import axiosClient from '../services/axiosClient';

export const documentApi = {
  listDocuments: async () => {
    const response = await axiosClient.get('/api/documents/');
    return response.data;
  },

  uploadDocument: async (title, file) => {
    const formData = new FormData(); // This is important because you're uploading a file. You cannot simply send a PDF using normal JSON
    formData.append('title', title); // used to send the title of the document to the backend
    formData.append('file', file); // used to send the file of the document to the backend
    const response = await axiosClient.post('/api/documents/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // This tells the backend that we are sending a file
      },
    });
    return response.data;
  },

  // This is used to get all the documents of a specific company. 
  listCompanyDocuments: async (companyId) => {
    const response = await axiosClient.get(`/api/documents/company/${companyId}/`);
    return response.data;
  },

  // This is used to delete a document.
  deleteDocument: async (documentId) => {
    await axiosClient.delete(`/api/documents/${documentId}/`);
  },
};

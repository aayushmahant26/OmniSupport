import axiosClient from '../services/axiosClient';

export const companyApi = {
  // Creates a new company profile.
  createCompany: async (payload) => {
    const response = await axiosClient.post('/api/companies/create/', payload);
    return response.data;
  },

  // Returns list of all companies
  listCompanies: async () => {
    const response = await axiosClient.get('/api/companies/');
    return response.data;
  },

  // Return details of one company
  getCompanyDetail: async (companyId) => {
    const response = await axiosClient.get(`/api/companies/${companyId}/`);
    return response.data;
  },

  // Returns list of companies in a category
  getCompaniesByCategory: async (category) => {
    const response = await axiosClient.get(`/api/companies/category/${category}/`);
    return response.data;
  },

  // Returns the logged-in company's profile.
  getMyCompany: async () => {
    const response = await axiosClient.get('/api/companies/me/');
    return response.data;
  },

  // Updates the logged-in company's profile.
  updateCompany: async (payload) => {
    const response = await axiosClient.patch('/api/companies/update/', payload);
    return response.data;
  },

  // Updates the logged-in company's logo.
  uploadLogo: async (logoFile) => {
    const formData = new FormData();
    formData.append('logo', logoFile);
    const response = await axiosClient.patch('/api/companies/logo/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // used for image data 
      },
    });
    return response.data;
  },


  // Returns the user's favorite companies.
  getFavorites: async () => {
    const response = await axiosClient.get('/api/companies/favorites/');
    return response.data;
  },

  // Adds or updates a favorite company for the user.
  setFavorite: async (category, companyId) => {
    const response = await axiosClient.post('/api/companies/favorites/', {
      category,
      company_id: companyId
    });
    return response.data;
  },

  // Returns the analytics for the logged-in company.
  getAnalytics: async () => {
    const response = await axiosClient.get('/api/companies/analytics/');
    return response.data;
  },

  // Generates a report for the logged-in company.
  generateReport: async () => {
    const response = await axiosClient.post('/api/companies/analytics/report/');
    return response.data;
  },
};


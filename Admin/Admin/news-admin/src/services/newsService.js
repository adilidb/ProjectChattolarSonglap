import axios from 'axios';

const API_BASE_URL = 'https://localhost:7207/api/news';

export const newsService = {
    getAllNews: async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching news:', error);
            throw error;
        }
    },

    getNewsById: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching news item:', error);
            throw error;
        }
    },

    createNews: async (formData) => {
        try {
            const response = await axios.post(API_BASE_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating news:', error);
            throw error;
        }
    },

    updateNews: async (id, formData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating news:', error);
            throw error;
        }
    },

    deleteNews: async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting news:', error);
            throw error;
        }
    }
};
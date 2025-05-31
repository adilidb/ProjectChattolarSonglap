import axios from 'axios';

const API_URL = 'https://localhost:7207/api/category';

export const getAllCategories = () => {
    return axios.get(API_URL);
};

export const getCategoryById = (id) => {
    if (!id) throw new Error("Category ID is required");
    return axios.get(`${API_URL}/${id}`);
};

export const createCategory = (category) => {
    return axios.post(API_URL, category);
};

export const updateCategory = (id, category) => {
    if (!id) throw new Error("Category ID is required for update");
    return axios.put(`${API_URL}/${id}`, category);
};

export const deleteCategory = (id) => {
    if (!id) throw new Error("Category ID is required for delete");
    return axios.delete(`${API_URL}/${id}`);
};

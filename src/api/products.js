import axios from "axios";

const API_URL = "http://localhost:8082/api/products";

export const getAllProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createProduct = async (newProduct) => {
  const response = await axios.post(API_URL, newProduct);
  return response.data;
};

export const updateProduct = async (id, updatedProduct) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedProduct);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
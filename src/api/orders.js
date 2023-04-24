import axios from "axios";

const API_URL = "http://localhost:8082/api/orders";

export const getAllOrder = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createOrder = async (newOrder) => {
  const response = await axios.post(API_URL, newOrder);
  return response.data;
};

export const updateOrder = async (id, updatedOrder) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedOrder);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
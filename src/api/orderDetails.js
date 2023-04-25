import axios from "axios";

const API_URL = "http://localhost:8082/api/order-details";

export const getAllOrderDetails = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getOrderDetailById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createOrderDetail = async (newOrderDetail) => {
  const response = await axios.post(API_URL, newOrderDetail);
  return response.data;
};

export const updateOrderDetail = async (id, updatedOrderDetail) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedOrderDetail);
  return response.data;
};

export const deleteOrderDetail = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
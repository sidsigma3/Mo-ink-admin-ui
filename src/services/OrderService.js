import axios from "axios";

// const BASE_URL = "http://localhost:8080/v1/api/orders";
const BASE_URL = ' http://82.25.105.65:8080/v1/api/orders'


export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${BASE_URL}`, orderData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error);
    throw error;
  }
};

export const updateOrder = async (orderId, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${orderId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order with ID ${orderId}:`, error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting order with ID ${orderId}:`, error);
    throw error;
  }
};

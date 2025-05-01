import axios from "axios";

const URL = process.env.REACT_APP_BASE_URL;
const BASE_URL = URL + '/orders'


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

export const updateOrderVariantStatuses = async (orderId,updates) => {
  try {
    const response = await axios.put(`${URL}/order-variants/status-update/${orderId}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating status of order with ID ${orderId}:`, error);
    throw error;
  }
};

export const updateOrderVariants = async (orderId,updates) => {
  try {
    const response = await axios.put(`${URL}/order-variants/update/${orderId}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating variant of order with ID ${orderId}:`, error);
    throw error;
  }
};


import axios from 'axios';


const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getAllProduct = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/product`);
    return response.data;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};


// Add a new product
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${BASE_URL}/product`, productData);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(`${BASE_URL}/product/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};


export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};



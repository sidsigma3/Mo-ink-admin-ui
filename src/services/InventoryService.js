import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;


export const getAllInventory = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/inventory`);
      return response.data;
    } catch (error) {
      console.error('Error getting discount:', error);
      throw error;
    }
  };


  export const getInventoryById = async (variantId) => {
    try {
      const response = await axios.get(`${BASE_URL}/inventory/${variantId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting discount:', error);
      throw error;
    }
  };


  export const getInventoryLogs = async (variantId) => {
    try {
      const response = await axios.get(`${BASE_URL}/inventory/${variantId}/logs`);
      return response.data;
    } catch (error) {
      console.error('Error getting discount:', error);
      throw error;
    }
  };


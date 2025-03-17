import axios from 'axios';

// const BASE_URL = 'http://localhost:8080/v1/api';
const BASE_URL = ' http://82.25.105.65:8080/v1/api'


export const getAllVendors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/vendor`);
      return response.data;
      
    } catch (error) {
      console.error('Error getting vendors:', error);
      throw error;
    }
  };


  export const addVendor = async (vendorData) => {
    try {
      const response = await axios.post(`${BASE_URL}/vendor`, vendorData);
      return response.data;
    } catch (error) {
      console.error('Error adding vendors:', error);
      throw error;
    }
  };


  export const updateVendor = async (vendorId, vendorData) => {
    try {
      const response = await axios.put(`${BASE_URL}/vendor/${vendorId}`, vendorData);
      return response.data;
    } catch (error) {
      console.error('Error updating vendors:', error);
      throw error;
    }
  };
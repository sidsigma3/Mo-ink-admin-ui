import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

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
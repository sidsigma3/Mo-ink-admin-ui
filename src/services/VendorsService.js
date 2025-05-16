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

  export const deleteVendor = async (vendorId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/vendor/${vendorId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting vendors:', error);
      throw error;
    }
  };

  export const createVendorRateChart = async (vendorId, productId, payload) => {
    try {
      const response = await axios.put(`${BASE_URL}/vendor/${vendorId}/vendor-rate-chart/product/${productId}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating rate chart for vendors:', error);
      throw error;
    }
  };

  export const getRateChart = async (vendorId) => {
    try {
      const response = await axios.get(`${BASE_URL}/vendor/${vendorId}/vendor-rate-chart`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rate chart for vendors:', error);
      throw error;
    }
  };


  export const vendorStatusUpdate = async (vendorOrderId,payload) => {
    try {
      const response = await axios.put(`${BASE_URL}/vendor-orders/${vendorOrderId}/status-update`,payload);
      return response.data;
    } catch (error) {
      console.error('Error changing status of vendor orders:', error);
      throw error;
    }
  };



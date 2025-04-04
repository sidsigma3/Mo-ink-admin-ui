import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getAllDiscount = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/discount`);
      console.log(response)
      return response.data;
      
    } catch (error) {
      console.error('Error getting discount:', error);
      throw error;
    }
  };


  export const addDiscount = async (discountData) => {
    try {
      const response = await axios.post(`${BASE_URL}/discount`, discountData);
      return response.data;
    } catch (error) {
      console.error('Error adding discount:', error);
      throw error;
    }
  };


  export const updateDiscount = async (discountId, discountData) => {
    try {
      const response = await axios.put(`${BASE_URL}/discount/${discountId}`, discountData);
      return response.data;
    } catch (error) {
      console.error('Error updating discount:', error);
      throw error;
    }
  };
  

  export const deleteDiscount = async (discountId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/discount/${discountId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting discount:', error);
      throw error;
    }
  };
  
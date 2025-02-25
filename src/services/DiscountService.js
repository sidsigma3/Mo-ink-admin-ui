import axios from 'axios';

const BASE_URL = 'http://localhost:8080/v1/api';

export const getAllDiscount = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/discount`);
      console.log(response)
      return response.data;
      
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  };


  export const addDiscount = async (discountData) => {
    try {
      const response = await axios.post(`${BASE_URL}/discount`, discountData);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };


  export const updateDiscount = async (discountId, discountData) => {
    try {
      const response = await axios.put(`${BASE_URL}/discount/${discountId}`, discountData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };
  
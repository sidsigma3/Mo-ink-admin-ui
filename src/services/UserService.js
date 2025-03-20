import axios from 'axios';


const BASE_URL = 'http://localhost:8080/v1/api';
// const BASE_URL = ' http://82.25.105.65:8080/v1/api'


export const getAllUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user`);
      return response.data;
      
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  };

  export const addUser = async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/user`, userData);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };


  export const updateUser = async (userId, userData) => {
    try {
      const response = await axios.put(`${BASE_URL}/user/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };
  
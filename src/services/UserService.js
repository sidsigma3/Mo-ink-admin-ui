import axios from 'axios';


const BASE_URL = process.env.REACT_APP_BASE_URL;



export const getAllUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user`);
      return response.data;
      
    } catch (error) {
      console.error('Error getting User:', error);
      throw error;
    }
  };

  export const getUserById = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting User:', error);
      throw error;
    }
  };

  export const addUser = async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/user`, userData);
      return response.data;
    } catch (error) {
      console.error('Error adding User:', error);
      throw error;
    }
  };


  export const updateUser = async (userId, userData) => {
    try {
      const response = await axios.put(`${BASE_URL}/user/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating User:', error);
      throw error;
    }
  };
  

  export const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error updating User:', error);
      throw error;
    }
  };


  
  export const activeNewUser = async (userId, masterId) => {
    try {
      const response = await axios.put(`${BASE_URL}/user/approve/${userId}?masterUserId=${masterId}`);
      return response.data;
    } catch (error) {
      console.error('Error updating User:', error);
      throw error;
    }
  };
  
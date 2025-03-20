import axios from 'axios';


const BASE_URL = 'http://localhost:8080/v1/api';
// const BASE_URL = ' http://82.25.105.65:8080/v1/api'


export const getAllSegment = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/segment`);
      return response.data;
    } catch (error) {
      console.error('Error getting segment:', error);
      throw error;
    }
  };


  export const addSegment = async (segmentData) => {
    try {
      const response = await axios.post(`${BASE_URL}/segment`, segmentData);
      return response.data;
    } catch (error) {
      console.error('Error adding segment:', error);
      throw error;
    }
  };

  export const updateSegment = async (segmentId, segmentData) => {
    try {
      const response = await axios.put(`${BASE_URL}/customer/${segmentId}`, segmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating segment:', error);
      throw error;
    }
  };
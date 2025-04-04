import axios from 'axios';


const BASE_URL = process.env.REACT_APP_BASE_URL;


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
      const response = await axios.put(`${BASE_URL}/segment/${segmentId}`, segmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating segment:', error);
      throw error;
    }
  };

  export const deleteSegment = async (segmentId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/segment/${segmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting segment:', error);
      throw error;
    }
  };
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL + '/colors';
const URL = process.env.REACT_APP_BASE_URL

export const getColorCountPerProduct = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/product-count`);
    return response.data?.data || []; // Return only the data array
  } catch (error) {
    console.error('Error fetching color count per product:', error);
    throw error;
  }
};


export const getColorsByProductId = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/${productId}`);
    return response.data?.data?.colors || [];
  } catch (error) {
    console.error(`Error fetching colors for product ${productId}:`, error);
    throw error;
  }
};

export const updateColorsByProductId = async (productId, colorList) => {
  try {
    const response = await axios.put(`${BASE_URL}/product/${productId}`, colorList);
    return response.data;
  } catch (error) {
    console.error('Error updating colors:', error);
    throw error;
  }
};


export const uploadColorLibraryImage = async (file,type) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${URL}/files/upload-image?type=${type}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error("Error uploading product image:", error);
    throw error;
  }
};
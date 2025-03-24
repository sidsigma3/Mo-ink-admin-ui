import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log(process.env)

export const getAllCustomer = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/customer`);
      return response.data;
      
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  };

  export const addCustomer = async (productData) => {
    try {
      const response = await axios.post(`${BASE_URL}/customer`, productData);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };
  
  // Update an existing product
  export const updateCustomer = async (productId, productData) => {
    try {
      const response = await axios.put(`${BASE_URL}/customer/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  export const deleteCustomer = async (customerId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };


 
export const addMoneyToWallet = async (customerId, amount) => {
    try {
      const response = await axios.post(`${BASE_URL}/customer/${customerId}/wallet`, {
        source: "Admin",
        amount: parseFloat(amount),
        type: "CREDIT", // Enum value for adding money
      });
      return response.data;
    } catch (error) {
      console.error("Error adding money to wallet:", error);
      throw error;
    }
  };
  
  
  export const subtractMoneyFromWallet = async (customerId, amount) => {
    try {
      const response = await axios.post(`${BASE_URL}/customer/${customerId}/wallet`, {
        source: "Admin",
        amount: parseFloat(amount),
        type: "DEBIT", // Enum value for subtracting money
      });
      return response.data;
    } catch (error) {
      console.error("Error subtracting money from wallet:", error);
      throw error;
    }
  };

  export const getWalletTransactions = async (customerId) => {
    try {
      const response = await axios.get(`${BASE_URL}/customer/${customerId}/wallet`);
      return response.data.data; // Returns the `data` array from the API response
    } catch (error) {
      console.error("Error fetching wallet transactions:", error);
      throw error;
    }
  };
  
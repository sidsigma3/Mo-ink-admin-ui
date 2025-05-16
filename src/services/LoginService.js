import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL
const API_URL =  BASE_URL + "/user/login";



export const loginUser = async (loginId, password) => {
  try {
    const response = await axios.post(API_URL, { loginId, password });
    console.log(response)

    if (response.data.status === "SUCCESS") {

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Login failed. Please try again." };
  }
};

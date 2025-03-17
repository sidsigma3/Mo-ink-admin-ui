import axios from "axios";

// const API_URL = "http://localhost:8080/v1/api/user/login";
const API_URL = ' http://82.25.105.65:8080/v1/api/user/login'


export const loginUser = async (userEmailId, password) => {
  try {
    const response = await axios.post(API_URL, { userEmailId, password });

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

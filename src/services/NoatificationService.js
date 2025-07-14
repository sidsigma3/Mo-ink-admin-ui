import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL + "/notifications";

export const getUserNotifications = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/USER/${userId}/unread`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const getUnreadCount = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/USER/${userId}/unread-count`);
    return response.data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

export const markNotificationRead = async (notificationId) => {
  try {
    const response = await axios.put(`${BASE_URL}/mark-read/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllUserNotificationsRead = async (userId) => {
  try {
    const response = await axios.put(`${BASE_URL}/USER/${userId}/mark-read`);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};


export const getPaginatedUserNotifications = async (userId, type, page = 1, size = 10) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/USER/${userId}/${type}/paginated?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching paginated notifications:', error);
    throw error;
  }
};

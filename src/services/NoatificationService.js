import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL + "/notifications";

export const getUserNotifications = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/USER/${userId}`);
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

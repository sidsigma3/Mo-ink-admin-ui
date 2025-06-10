import React, { useEffect, useState } from 'react';
import './NotificationPage.css';
import {
  getUserNotifications,
  markNotificationRead,
  markAllUserNotificationsRead
} from '../../../services/NoatificationService';

const TABS = ['All', 'Orders', 'Users'];
const userData = JSON.parse(localStorage.getItem('userData'))
const USER_ID = userData?.userId;


const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUserNotifications(USER_ID);
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllUserNotificationsRead(USER_ID);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const filtered = activeTab === 'All'
    ? notifications
    : notifications.filter((n) => n.type === activeTab.toLowerCase());




  const formatDateToIST = (dateStr) => {
  // const trimmedDateStr = dateStr.split('.')[0] + 'Z'; 
  const utcDate = new Date(dateStr);
 
  return utcDate.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
    

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Notifications Center</h2>
        <div className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* <button className="mark-all-btn" onClick={handleMarkAllRead}>
          Mark All as Read
        </button> */}
      </div>

      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center p-4">No notifications available.</div>
      ) : (
        <div className="notifications-list">
          {filtered.map(({ id, icon = '🔔', title, message, createdAt, isRead }) => (
            <div
              className={`notification-card ${isRead ? '' : 'unread'}`}
              key={id}
              onClick={() => handleMarkSingleRead(id)}
            >
              <div className="icon">{icon}</div>
              <div className="details">
                <div className="title">{title}</div>
                <div className="desc">{message}</div>
                <div className="time">{formatDateToIST(createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;

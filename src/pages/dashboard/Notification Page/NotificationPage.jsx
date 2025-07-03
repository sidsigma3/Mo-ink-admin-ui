import React, { useEffect, useState } from 'react';
import './NotificationPage.css';
import {
  getUserNotifications,
  markNotificationRead,
  markAllUserNotificationsRead,
  getPaginatedUserNotifications,
} from '../../../services/NoatificationService';

const TABS = ['Inventory', 'User', 'Return'];
const userData = JSON.parse(localStorage.getItem('userData'))
const USER_ID = userData?.userId;


const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState('Inventory');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (selectedTab = activeTab, currentPage = page) => {
  try {
    setLoading(true);

    const type = selectedTab.toUpperCase(); // INVENTORY, USER, RETURN
    const data = await getPaginatedUserNotifications(USER_ID, type, currentPage, 10);
    
    setNotifications(data?.content || []);
    setTotalPages(data?.totalPages || 1);
  } catch (error) {
    console.error("Failed to load notifications:", error);
  } finally {
    setLoading(false);
  }
};

 const handleTabClick = (tab) => {
  setActiveTab(tab);
  setPage(1); // Reset to first page
  fetchNotifications(tab, 1);
};

const handlePageChange = (newPage) => {
  setPage(newPage);
  fetchNotifications(activeTab, newPage);
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
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  } catch (error) {
    console.error("Failed to mark as read:", error);
  }
};


 const filtered = notifications.filter((n) => {
  const title = n.title?.toLowerCase();

  if (activeTab === 'Inventory') return title === 'inventory alert';
  if (activeTab === 'User')
    return (
      title === 'new admin account pending approval' ||
      title === 'new sales account pending approval'
    );
  if (activeTab === 'Return') return title === 'order return requested';

  return false;
});



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
          <div className="mark-all-container">
            <button className="mark-all-btn" onClick={handleMarkAllRead}>
              Mark All as Read
            </button>
         </div>
      </div>

      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center p-4">No notifications available.</div>
      ) : (
        <div className="notifications-list">
          {filtered.map(({ id, icon = '🔔', title, message, createdAt, read }) => (
            <div
              className={`notification-card ${read ? '' : 'unread'}`}
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

      
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default NotificationPage;

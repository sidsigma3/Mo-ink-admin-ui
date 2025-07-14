import { useEffect, useState, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getUserNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllUserNotificationsRead,
} from '../../services/NoatificationService';
import './Notifications.css';



export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('userData'))
  const userId = userData.userId;


  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
    fetchUnreadCount();
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications(userId);
      console.log(data)
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount(userId);
      setUnreadCount(data.data || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllUserNotificationsRead(userId);
      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };


const getNotificationClass = (title = '') => {
  const normalized = title.toLowerCase();

  if (normalized === 'inventory alert') return 'notification-inventory';
  if (normalized.includes('admin account') || normalized.includes('sales account')) return 'notification-user';
  if (normalized.includes('return')) return 'notification-return';

  return 'notification-default';
};



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
    <div className="notifications-wrapper">
      <div className="notification-button" onClick={() => setIsOpen(!isOpen)} ref={dropdownRef}>
        <button className="bell-icon">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && <span className="notification-badge"></span>}
        </button>

        {isOpen && (
          <div className="notification-dropdown">
            <div className="dropdown-header">
              <span className="header">Notifications</span>
              <X className="close-icon" onClick={() => setIsOpen(false)} />
            </div>

            <div className="unread-container">
              <div className="unread">
                <span className="unread-text">Unread</span>
                <span className="unread-count">{unreadCount}</span>
              </div>
              <span
                className="view-all"
                onClick={() => navigate('/notificationpage')}
                style={{ cursor: 'pointer' }}
              >
                View All
              </span>
            </div>

            <div className="notification-list">
              {notifications.map((notification) => (
                <div
                    key={notification.id}
                 className={`notification-item ${notification.read ? '' : 'unread-notification'} ${getNotificationClass(notification.title)}`}
                     onClick={async () => {
                      try {
                        if (!notification.read) {
                          await markNotificationRead(notification.id);
                          fetchUnreadCount(); // optional, to update badge count
                        }

                        navigate('/notificationpage'); // redirect after marking as read
                      } catch (error) {
                        console.error("Error handling notification click:", error);
                      }
                    }}
                  >

                  <div className="notification-icon">{notification.icon || '🔔'}</div>
                  <div className="notification-content">
                    <p className="notification-title">{notification.title}</p>
                    <p className="notification-description">{notification.message}</p>
                    <p className="notification-time">{formatDateToIST(notification.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* {notifications.length > 0 && (
              <div className="mark-all-read" onClick={handleMarkAllRead}>
                Mark all as read
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}

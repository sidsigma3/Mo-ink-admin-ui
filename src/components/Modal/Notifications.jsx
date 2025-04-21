import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X } from 'lucide-react';
import './Notifications.css';

const notifications = [
  
  {
    id: 1,
    type: 'order',
    title: 'Order Placed by ABC Electronics',
    description: 'A new order (#12345) of 3 items has been placed by the customer.',
    time: '2025-04-14 10:20:45',
    icon: '🛒',
  },
  {
    id: 2,
    type: 'order',
    title: 'Order Cancelled by XYZ Corp',
    description: 'Order (#12340) was cancelled by the user.',
    time: '2025-04-13 16:05:10',
    icon: '❌',
  },
  {
    id: 3,
    type: 'user',
    title: 'New User Signup: John Doe',
    description: 'A new user just signed up with email john@example.com',
    time: '2025-04-13 12:30:12',
    icon: '👤',
  },
  {
    id: 4,
    type: 'user',
    title: 'Profile Updated: Jane Smith',
    description: 'User Jane Smith updated their shipping address.',
    time: '2025-04-12 09:12:50',
    icon: '🔧',
  },
];

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="notifications-wrapper">
      <div
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
        ref={dropdownRef}
      >
        <button className="bell-icon">
          <Bell className="w-6 h-6" />
          <span className="notification-badge" />
        </button>

        {isOpen && (
          <div className="notification-dropdown">
            <div className="dropdown-header ">
              <span className="header">Notifications</span>
              <X className="close-icon" onClick={() => setIsOpen(false)} />
            </div>

            <div className="unread-container">
              <div className="unread">
                <span className="unread-text">Unread</span>
                <span className="unread-count">{notifications.length}</span>
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
                <div key={notification.id} className="notification-item">
                  <div className="notification-icon">
                    {notification.icon}
                  </div>
                  <div className="notification-content">
                    <p className="notification-title">{notification.title}</p>
                    <p className="notification-description">{notification.description}</p>
                    <p className="notification-time">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

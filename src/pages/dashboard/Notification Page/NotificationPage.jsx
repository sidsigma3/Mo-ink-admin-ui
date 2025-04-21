import React, { useState } from 'react';
import './NotificationPage.css';


const TABS = ['All', 'Orders', 'Users'];

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
  {
    id: 5,
    type: 'user',
    title: 'Profile Updated: Jane Smith',
    description: 'User Jane Smith updated their shipping address.',
    time: '2025-04-12 09:12:50',
    icon: '🔧',
  },
  {
    id: 6,
    type: 'user',
    title: 'Profile Updated: Jane Smith',
    description: 'User Jane Smith updated their shipping address.',
    time: '2025-04-12 09:12:50',
    icon: '🔧',
  },
  {
    id: 7,
    type: 'user',
    title: 'Profile Updated: Jane Smith',
    description: 'User Jane Smith updated their shipping address.',
    time: '2025-04-12 09:12:50',
    icon: '🔧',
  },
  {
    id: 8,
    type: 'user',
    title: 'Profile Updated: Jane Smith',
    description: 'User Jane Smith updated their shipping address.',
    time: '2025-04-12 09:12:50',
    icon: '🔧',
  },
  {
    id: 9,
    type: 'user',
    title: 'Profile Updated: Jane Smith',
    description: 'User Jane Smith updated their shipping address.',
    time: '2025-04-12 09:12:50',
    icon: '🔧',
  },
  {
    id: 10,
    type: 'user',
    title: 'Profile Updated: Jane Smith',
    description: 'User Jane Smith updated their shipping address.',
    time: '2025-04-12 09:12:50',
    icon: '🔧',
  },
  {
    id: 11,
    type: 'user',
    title: 'Profile Updated: Jane Smith',
    description: 'User Jane Smith updated their shipping address.',
    time: '2025-04-12 09:12:50',
    icon: '🔧',
  },
];

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All'
    ? notifications
    : notifications.filter((n) => n.type === activeTab.toLowerCase());

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Notifications Center</h2>
        <div className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="notifications-list">
        {filtered.map(({ id, icon, title, description, time }) => (
          <div className="notification-card" key={id}>
            <div className="icon">{icon}</div>
            <div className="details">
              <div className="title">{title}</div>
              <div className="desc">{description}</div>
              <div className="time">{time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;

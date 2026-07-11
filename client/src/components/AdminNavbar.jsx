import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  FaCalendarAlt,
  FaClock,
  FaSearch,
  FaSun,
  FaMoon,
  FaBell,
  FaTimes,
  FaCheckDouble,
  FaExclamationTriangle,
  FaShoppingBag,
  FaUserPlus,
  FaTimesCircle,
  FaBars
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import './AdminNavbar.css';

const AdminNavbar = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll notifications from live MongoDB data every 10 seconds
  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchNotifications = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get('/api/admin/notifications', config);
        setNotifications(res.data || []);
      } catch (err) {
        console.error('Failed to load navbar notifications', err);
      }
    };

    fetchNotifications();
    const pollInterval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(pollInterval);
  }, [user]);

  // Resolve corresponding icon based on notification parameters
  const getNotificationIcon = (type, title) => {
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('stock') || type === 'warning') return FaExclamationTriangle;
    if (titleLower.includes('customer') || titleLower.includes('signup')) return FaUserPlus;
    if (titleLower.includes('cancelled') || type === 'danger') return FaTimesCircle;
    if (titleLower.includes('pending') || type === 'info') return FaClock;
    return FaShoppingBag;
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleRemoveNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <header className="admin-navbar">
      <div className="topbar-welcome" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          className="navbar-icon-action-btn mobile-hamburger-toggle" 
          onClick={toggleSidebar} 
          aria-label="Toggle Sidebar"
          style={{ display: 'none' }} // Hidden on desktop via CSS, shown on mobile
        >
          <FaBars />
        </button>
        <div>
          <h1>Welcome back, Administrator</h1>
          <div className="datetime-badge">
            <FaCalendarAlt />
            <span>{currentTime.toLocaleDateString()}</span>
            <FaClock />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="topbar-actions-row">
        {/* Global search */}
        <div className="navbar-search-wrapper">
          <FaSearch />
          <input
            type="text"
            placeholder="Global search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dark Mode toggle */}
        <button className="navbar-icon-action-btn theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>

        {/* Dynamic notifications bell */}
        <div className="notification-bell-container">
          <button className="navbar-icon-action-btn bell-btn" onClick={() => setNotificationsOpen(!notificationsOpen)} title="Notifications">
            <FaBell />
            {notifications.length > 0 && <span className="bell-badge">{notifications.length}</span>}
          </button>

          {notificationsOpen && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h4>Notifications ({notifications.length})</h4>
                {notifications.length > 0 && (
                  <button onClick={handleClearAll} className="clear-all-alerts-btn">Clear All</button>
                )}
              </div>
              <div className="dropdown-body scrollbar-styled">
                {notifications.length > 0 ? (
                  notifications.map((n) => {
                    const Icon = getNotificationIcon(n.type, n.title);
                    return (
                      <div key={n.id} className={`dropdown-alert-row ${n.type}`}>
                        <Icon className="alert-row-icon" />
                        <div className="alert-row-text">
                          <h5>{n.title}</h5>
                          <p>{n.text}</p>
                        </div>
                        <button className="remove-alert-btn" onClick={() => handleRemoveNotification(n.id)}>
                          <FaTimes />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-alerts-box">
                    <FaCheckDouble className="no-alerts-icon" />
                    <p>No new alerts.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User initials tag */}
        {user && (
          <div className="topbar-profile">
            <div className="avatar-letter">{user.name.charAt(0).toUpperCase()}</div>
            <div className="profile-details-text">
              <span className="name">{user.name}</span>
              <span className="role-lbl">Admin</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;

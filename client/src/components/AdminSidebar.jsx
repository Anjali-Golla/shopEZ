import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaChartLine,
  FaUsers,
  FaBoxOpen,
  FaShoppingBag,
  FaTags,
  FaRegFileAlt,
  FaPercent,
  FaCog,
  FaSignOutAlt,
  FaBars
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import './AdminSidebar.css';

const AdminSidebar = ({ collapsed, toggleSidebar }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: FaChartLine },
    { id: 'products', label: 'Products', path: '/admin/products', icon: FaBoxOpen },
    { id: 'categories', label: 'Categories', path: '/admin/categories', icon: FaTags },
    { id: 'orders', label: 'Orders', path: '/admin/orders', icon: FaShoppingBag },
    { id: 'users', label: 'Users', path: '/admin/users', icon: FaUsers },
    { id: 'reviews', label: 'Reviews', path: '/admin/reviews', icon: FaRegFileAlt },
    { id: 'coupons', label: 'Coupons', path: '/admin/coupons', icon: FaPercent },
    { id: 'analytics', label: 'Analytics', path: '/admin/analytics', icon: FaChartLine },
    { id: 'settings', label: 'Settings', path: '/admin/settings', icon: FaCog }
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand-wrapper">
        {!collapsed && (
          <div className="brand-logo-flex">
            <h2>ShopEZ</h2>
          </div>
        )}
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
          <FaBars />
        </button>
      </div>

      <nav className="sidebar-nav">
        {sidebarItems.map((item) => {
          const IconComp = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
              title={item.label}
            >
              <IconComp />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
        
        <button className="nav-btn logout-btn" onClick={handleLogout} title="Logout">
          <FaSignOutAlt />
          {!collapsed && <span>Logout</span>}
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;

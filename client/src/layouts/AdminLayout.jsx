import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className={`admin-layout-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <AdminSidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="admin-main-wrapper">
        <AdminNavbar toggleSidebar={toggleSidebar} />
        <div className="admin-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

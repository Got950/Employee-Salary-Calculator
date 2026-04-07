/**
 * Sidebar - Dark theme navigation
 */

import React from 'react';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⌂' },
  { id: 'employees', label: 'Employees', icon: '👥' },
  { id: 'salary', label: 'Salary', icon: '₮' },
];

const Sidebar = ({ activeView, onNavigate }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">▁▃▅</span>
        <span className="sidebar-logo-text">Logo</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeView === item.id ? 'sidebar-item-active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            <span className="sidebar-item-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        <button className="sidebar-item sidebar-item-settings">
          <span className="sidebar-item-label">Settings</span>
          <span className="sidebar-item-arrow">›</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

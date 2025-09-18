import React from 'react';

function Navigation({ currentPage, onNavigate, currentUser, onLogout }) {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>Task Manager</h2>
      </div>
      <div className="nav-links">
        <button
          className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-button ${currentPage === 'tasks' ? 'active' : ''}`}
          onClick={() => onNavigate('tasks')}
        >
          Tasks
        </button>
        <button
          className={`nav-button ${currentPage === 'users' ? 'active' : ''}`}
          onClick={() => onNavigate('users')}
        >
          Users
        </button>
        <button
          className="nav-button create-button"
          onClick={() => onNavigate('create-task')}
        >
          Create New Task
        </button>
      </div>
      <div className="nav-user">
        <div className="user-info">
          <span className="user-name">{currentUser?.name}</span>
          <span className={`user-role role-${currentUser?.role?.toLowerCase()}`}>
            {currentUser?.role}
          </span>
        </div>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
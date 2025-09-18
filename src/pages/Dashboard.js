import React from 'react';
import Statistics from '../components/Statistics';
import RecentActivity from '../components/RecentActivity';

function Dashboard({ tasks, activities, onNavigate }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button
          className="create-task-button"
          onClick={() => onNavigate('create-task')}
        >
          Create New Task
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <Statistics tasks={tasks} />
        </div>

        <div className="dashboard-section">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
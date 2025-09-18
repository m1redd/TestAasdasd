import React from 'react';

function Statistics({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;

  return (
    <div className="statistics">
      <h3>Task Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completedTasks}</div>
          <div className="stat-label">Completed Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{inProgressTasks}</div>
          <div className="stat-label">In-Progress Tasks</div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
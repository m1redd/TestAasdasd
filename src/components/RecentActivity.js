import React from 'react';

function RecentActivity({ activities }) {
  const recentActivities = activities.slice(0, 5);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'created': return 'action-created';
      case 'updated': return 'action-updated';
      case 'completed': return 'action-completed';
      case 'deleted': return 'action-deleted';
      default: return '';
    }
  };

  return (
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {recentActivities.length === 0 ? (
          <div className="no-activity">No recent activity</div>
        ) : (
          recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-content">
                <div className="activity-title">{activity.taskTitle}</div>
                <div className="activity-details">
                  <span className={`activity-action ${getActionColor(activity.action)}`}>
                    {activity.action}
                  </span>
                  <span className="activity-user">by {activity.user}</span>
                  <span className="activity-time">{formatTimestamp(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentActivity;
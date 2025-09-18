import React, { useState } from 'react';
import { refreshUsers } from '../utils/users';

function TaskDetail({ taskId, tasks, onNavigate, onUpdateTask, onDeleteTask, getTaskHistory, onCreateTask }) {
  const task = tasks.find(t => t.id === parseInt(taskId));
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!task) {
    return (
      <div className="task-detail">
        <div className="task-detail-header">
          <h1>Task Not Found</h1>
          <button
            className="back-button"
            onClick={() => onNavigate('tasks')}
          >
            Back to Tasks
          </button>
        </div>
        <div className="task-not-found">
          <p>The requested task could not be found.</p>
        </div>
      </div>
    );
  }

  const startEditing = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      assignee: task.assignee,
      status: task.status,
      dueDate: task.dueDate || ''
    });
    setIsEditing(true);
    setErrors({});
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditData({});
    setErrors({});
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editData.title?.trim()) {
      newErrors.title = 'Title is required';
    } else if (editData.title.trim().length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
    }

    if (editData.description && editData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    if (!editData.priority) {
      newErrors.priority = 'Priority is required';
    }

    if (!editData.assignee) {
      newErrors.assignee = 'Assignee is required';
    }

    if (editData.dueDate) {
      const selectedDate = new Date(editData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveChanges = () => {
    if (!validateEditForm()) {
      return;
    }

    const updatedTask = {
      ...task,
      title: editData.title.trim(),
      description: editData.description.trim(),
      priority: editData.priority,
      assignee: editData.assignee,
      status: editData.status,
      dueDate: editData.dueDate || null,
      updatedAt: new Date().toISOString()
    };

    onUpdateTask(task.id, updatedTask);
    setIsEditing(false);
    setEditData({});
    setErrors({});
  };

  const handleStatusChange = (newStatus) => {
    onUpdateTask(task.id, {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    onDeleteTask(task.id);
    onNavigate('tasks');
  };

  const handleDuplicate = (originalTask) => {
    // Generate unique task ID
    const generateUniqueTaskId = () => {
      let newTaskId;
      let isUnique = false;

      while (!isUnique) {
        newTaskId = `TASK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        isUnique = !tasks.some(task => task.taskId === newTaskId);
      }

      return newTaskId;
    };

    // Create duplicated task
    const duplicatedTask = {
      id: Date.now(),
      taskId: generateUniqueTaskId(),
      title: `Copy of ${originalTask.title}`,
      description: originalTask.description,
      priority: originalTask.priority,
      status: 'To Do', // Reset to To Do
      assignee: originalTask.assignee,
      dueDate: null, // Reset due date
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: 'Current User' // Will be updated by App component
    };

    // Create the task and navigate to it
    onCreateTask(duplicatedTask);

    // Show success message and navigate to new task
    setTimeout(() => {
      // Find the newly created task and navigate to it
      const newTaskId = duplicatedTask.id;
      onNavigate('task-detail', newTaskId);
    }, 100);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'status-todo';
      case 'In Progress': return 'status-progress';
      case 'Done': return 'status-done';
      default: return '';
    }
  };

  const taskHistory = getTaskHistory(task.id);

  if (showDeleteConfirm) {
    return (
      <div className="task-detail">
        <div className="delete-confirmation">
          <div className="delete-confirmation-content">
            <div className="delete-icon">⚠️</div>
            <h2>Delete Task</h2>
            <p>Are you sure you want to delete this task?</p>
            <div className="task-preview">
              <strong>"{task.title}"</strong>
            </div>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="confirmation-actions">
              <button
                className="confirm-delete-button"
                onClick={handleDelete}
              >
                Yes, Delete Task
              </button>
              <button
                className="cancel-delete-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="task-detail">
      <div className="task-detail-header">
        <h1>Task Details</h1>
        <button
          className="back-button"
          onClick={() => onNavigate('tasks')}
        >
          Back to Tasks
        </button>
      </div>

      <div className="task-detail-content">
        <div className="task-detail-main">
          <div className="task-detail-section">
            <div className="task-id">
              <span className="task-id-label">Task ID:</span>
              <span className="task-id-value">{task.taskId}</span>
            </div>

            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="edit-title">Task Title *</label>
                  <input
                    type="text"
                    id="edit-title"
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    placeholder="Enter task title (1-100 characters)"
                    maxLength={100}
                    className={errors.title ? 'error' : ''}
                  />
                  <div className="field-info">
                    <span className="char-count">{editData.title?.length || 0}/100</span>
                  </div>
                  {errors.title && <div className="error-message">{errors.title}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="edit-description">Description</label>
                  <textarea
                    id="edit-description"
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    placeholder="Enter task description (optional, max 500 characters)"
                    rows={4}
                    maxLength={500}
                    className={errors.description ? 'error' : ''}
                  />
                  <div className="field-info">
                    <span className="char-count">{editData.description?.length || 0}/500</span>
                  </div>
                  {errors.description && <div className="error-message">{errors.description}</div>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-priority">Priority *</label>
                    <select
                      id="edit-priority"
                      value={editData.priority}
                      onChange={(e) => setEditData({...editData, priority: e.target.value})}
                      className={errors.priority ? 'error' : ''}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    {errors.priority && <div className="error-message">{errors.priority}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-status">Status *</label>
                    <select
                      id="edit-status"
                      value={editData.status}
                      onChange={(e) => setEditData({...editData, status: e.target.value})}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-assignee">Assignee *</label>
                    <select
                      id="edit-assignee"
                      value={editData.assignee}
                      onChange={(e) => setEditData({...editData, assignee: e.target.value})}
                      className={errors.assignee ? 'error' : ''}
                    >
                      {refreshUsers().map(user => (
                        <option key={user.id} value={user.name}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    {errors.assignee && <div className="error-message">{errors.assignee}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-dueDate">Due Date</label>
                    <input
                      type="date"
                      id="edit-dueDate"
                      value={editData.dueDate}
                      onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
                      min={getTodayDate()}
                      className={errors.dueDate ? 'error' : ''}
                    />
                    {errors.dueDate && <div className="error-message">{errors.dueDate}</div>}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="task-title">{task.title}</h2>

                {task.description && (
                  <div className="task-description">
                    <h3>Description</h3>
                    <p>{task.description}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {!isEditing && (
            <div className="task-detail-section">
              <h3>Task Information</h3>
              <div className="task-info-grid">
                <div className="info-item">
                  <label>Status:</label>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`status-select ${getStatusColor(task.status)}`}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div className="info-item">
                  <label>Priority:</label>
                  <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>

                <div className="info-item">
                  <label>Assignee:</label>
                  <span>{task.assignee || 'Unassigned'}</span>
                </div>

                <div className="info-item">
                  <label>Created:</label>
                  <span>{formatDate(task.createdAt)}</span>
                </div>

                {task.updatedAt !== task.createdAt && (
                  <div className="info-item">
                    <label>Last Updated:</label>
                    <span>{formatDate(task.updatedAt)}</span>
                  </div>
                )}

                {task.dueDate && (
                  <div className="info-item">
                    <label>Due Date:</label>
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="task-detail-section">
            <h3>Task History</h3>
            <div className="task-history">
              {taskHistory.length === 0 ? (
                <div className="no-history">No history available</div>
              ) : (
                <div className="history-list">
                  {taskHistory.map(entry => (
                    <div key={entry.id} className="history-entry">
                      <div className="history-header">
                        <span className={`history-action ${entry.action}`}>
                          {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                        </span>
                        <span className="history-user">by {entry.user}</span>
                        <span className="history-time">{formatDate(entry.timestamp)}</span>
                      </div>
                      {entry.changes && Object.keys(entry.changes).length > 0 && (
                        <div className="history-changes">
                          {Object.entries(entry.changes).map(([field, change]) => (
                            <div key={field} className="change-item">
                              <strong>{field}:</strong>
                              {change.from !== undefined ? (
                                <span> changed from "{change.from}" to "{change.to}"</span>
                              ) : (
                                <span> set to "{change.to || change}"</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="task-detail-actions">
          {isEditing ? (
            <>
              <button
                className="save-button"
                onClick={saveChanges}
              >
                Save Changes
              </button>
              <button
                className="cancel-button"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="edit-button"
                onClick={startEditing}
              >
                Edit Task
              </button>
              <button
                className="duplicate-button"
                onClick={() => handleDuplicate(task)}
              >
                📋 Duplicate Task
              </button>
              <button
                className="delete-button"
                onClick={confirmDelete}
              >
                Delete Task
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
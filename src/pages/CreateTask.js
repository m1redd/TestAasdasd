import React, { useState } from 'react';
import { refreshUsers } from '../utils/users';

function CreateTask({ onCreateTask, onNavigate, existingTasks = [] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const generateUniqueTaskId = () => {
    let taskId;
    let isUnique = false;

    while (!isUnique) {
      taskId = `TASK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      isUnique = !existingTasks.some(task => task.taskId === taskId);
    }

    return taskId;
  };

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
    }

    // Description validation
    if (description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    // Priority validation
    if (!priority) {
      newErrors.priority = 'Priority is required';
    }

    // Assignee validation
    if (!assignee) {
      newErrors.assignee = 'Assignee is required';
    }

    // Due date validation
    if (dueDate) {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newTask = {
      id: Date.now(),
      taskId: generateUniqueTaskId(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'To Do',
      assignee,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: 'Current User'
    };

    onCreateTask(newTask);

    // Show success message
    setShowSuccess(true);

    // Redirect after short delay
    setTimeout(() => {
      onNavigate('tasks');
    }, 1500);
  };

  const handleCancel = () => {
    onNavigate('tasks');
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (showSuccess) {
    return (
      <div className="create-task">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Task Created Successfully!</h2>
          <p>Your task has been created and you will be redirected to the task list.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-task">
      <div className="create-task-header">
        <h1>Create New Task</h1>
        <button
          className="back-button"
          onClick={() => onNavigate('tasks')}
        >
          Back to Tasks
        </button>
      </div>

      <form className="create-task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title (1-100 characters)"
            maxLength={100}
            className={errors.title ? 'error' : ''}
          />
          <div className="field-info">
            <span className="char-count">{title.length}/100</span>
          </div>
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional, max 500 characters)"
            rows={4}
            maxLength={500}
            className={errors.description ? 'error' : ''}
          />
          <div className="field-info">
            <span className="char-count">{description.length}/500</span>
          </div>
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={errors.priority ? 'error' : ''}
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.priority && <div className="error-message">{errors.priority}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="assignee">Assignee *</label>
            <select
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className={errors.assignee ? 'error' : ''}
            >
              <option value="">Select Assignee</option>
              {refreshUsers().map(user => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.assignee && <div className="error-message">{errors.assignee}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={getTodayDate()}
            className={errors.dueDate ? 'error' : ''}
          />
          <div className="field-info">
            <span className="field-hint">Optional - Select a future date</span>
          </div>
          {errors.dueDate && <div className="error-message">{errors.dueDate}</div>}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Create Task
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTask;
import React, { useState, useMemo } from 'react';

function TaskList({ tasks, onUpdateTask, onDeleteTask, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getPriorityValue = (priority) => {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filter by search term (minimum 3 characters)
    if (searchTerm.length >= 3) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'priority':
          aValue = getPriorityValue(a.priority);
          bValue = getPriorityValue(b.priority);
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [tasks, statusFilter, searchTerm, sortField, sortDirection]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'To Do': return 'status-todo';
      case 'In Progress': return 'status-progress';
      case 'Done': return 'status-done';
      default: return '';
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="task-list-page">
      <div className="task-list-header">
        <h1>All Tasks</h1>
        <button
          className="create-task-button"
          onClick={() => onNavigate('create-task')}
        >
          Create New Task
        </button>
      </div>

      <div className="task-list-filters">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search tasks (min 3 characters)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-field"
          />
        </div>

        <div className="filter-dropdown">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      <div className="task-table-container">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="no-tasks-found">
            <p>No tasks found</p>
            {(searchTerm.length >= 3 || statusFilter !== 'All') && (
              <p className="filter-message">
                Try adjusting your search or filter criteria
              </p>
            )}
          </div>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Title</th>
                <th>Status</th>
                <th
                  className={`sortable ${sortField === 'priority' ? 'active' : ''}`}
                  onClick={() => handleSort('priority')}
                >
                  Priority {getSortIcon('priority')}
                </th>
                <th>Assignee</th>
                <th
                  className={`sortable ${sortField === 'createdAt' ? 'active' : ''}`}
                  onClick={() => handleSort('createdAt')}
                >
                  Created Date {getSortIcon('createdAt')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTasks.map(task => (
                <tr
                  key={task.id}
                  className="task-row"
                  onClick={() => onNavigate('task-detail', task.id)}
                >
                  <td className="task-id-cell">{task.taskId}</td>
                  <td className="task-title-cell">{task.title}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td>{task.assignee || 'Unassigned'}</td>
                  <td>
                    <div className="date-info">
                      <span>{formatDate(task.createdAt)}</span>
                      {task.dueDate && (
                        <span className="due-date">Due: {formatDate(task.dueDate)}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TaskList;
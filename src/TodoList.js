import React, { useState } from 'react';

function TodoList({ tasks = [], onUpdateTask, onDeleteTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const deleteTodo = (id) => {
    onDeleteTask(id);
  };

  const toggleComplete = (id) => {
    const task = tasks.find(t => t.id === id);
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    onUpdateTask(id, { ...task, status: newStatus, updatedAt: new Date().toISOString() });
  };

  const updateTaskStatus = (id, newStatus) => {
    const task = tasks.find(t => t.id === id);
    onUpdateTask(id, { ...task, status: newStatus, updatedAt: new Date().toISOString() });
  };

  const startEditing = (id, title) => {
    setEditingId(id);
    setEditingText(title);
  };

  const saveEdit = () => {
    if (editingText.trim()) {
      const task = tasks.find(t => t.id === editingId);
      onUpdateTask(editingId, {
        ...task,
        title: editingText.trim(),
        updatedAt: new Date().toISOString()
      });
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="todo-list-container">
      <ul className="todo-list">
        {tasks.map(task => (
          <li key={task.id} className={`todo-item ${task.status === 'completed' ? 'completed' : ''} ${getPriorityColor(task.priority)}`}>
            {editingId === task.id ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyPress={handleEditKeyPress}
                  autoFocus
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div className="view-mode">
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => toggleComplete(task.id)}
                  />
                  <div className="task-details">
                    <span className="task-title">{task.title}</span>
                    {task.description && (
                      <span className="task-description">{task.description}</span>
                    )}
                    <div className="task-meta">
                      <span className={`task-priority ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="task-status">{task.status}</span>
                      <span className="task-date">
                        {new Date(task.updatedAt || task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="task-actions">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button onClick={() => startEditing(task.id, task.title)}>Edit</button>
                  <button onClick={() => deleteTodo(task.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
        {tasks.length === 0 && (
          <li className="no-tasks">No tasks available. Create your first task!</li>
        )}
      </ul>
    </div>
  );
}

export default TodoList;
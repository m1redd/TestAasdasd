import React, { useState, memo, useMemo, useCallback } from 'react';

function KanbanBoard({ tasks, onUpdateTask, onNavigate }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const columns = useMemo(() => [
    { id: 'To Do', title: 'To Do', color: '#f0f0f0' },
    { id: 'In Progress', title: 'In Progress', color: '#e3f2fd' },
    { id: 'Done', title: 'Done', color: '#e8f5e8' }
  ], []);

  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (draggedTask && draggedTask.status !== newStatus) {
      onUpdateTask(draggedTask.id, {
        ...draggedTask,
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#ff5722';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const TaskCard = memo(({ task }) => (
    <div
      className="kanban-card"
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onDragEnd={handleDragEnd}
      onClick={() => onNavigate('task-detail', task.id)}
    >
      <div className="card-header">
        <span className="task-id">{task.taskId}</span>
        <div
          className="priority-indicator"
          style={{ backgroundColor: getPriorityColor(task.priority) }}
          title={`${task.priority} Priority`}
        ></div>
      </div>

      <h4 className="card-title">{task.title}</h4>

      {task.description && (
        <p className="card-description">
          {task.description.length > 100
            ? `${task.description.substring(0, 100)}...`
            : task.description}
        </p>
      )}

      <div className="card-footer">
        <div className="assignee">
          <span className="assignee-avatar">
            {task.assignee ? task.assignee.charAt(0).toUpperCase() : 'U'}
          </span>
          <span className="assignee-name">{task.assignee || 'Unassigned'}</span>
        </div>

        {task.dueDate && (
          <div className="due-date">
            📅 {formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  ));

  // Memoize column data to prevent unnecessary re-renders
  const columnData = useMemo(() => {
    return columns.map(column => ({
      ...column,
      tasks: getTasksByStatus(column.id),
      taskCount: getTasksByStatus(column.id).length
    }));
  }, [columns, getTasksByStatus]);

  return (
    <div className="kanban-board">
      <div className="kanban-columns">
        {columnData.map(column => (
          <div
            key={column.id}
            className={`kanban-column ${dragOverColumn === column.id ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            style={{ backgroundColor: column.color }}
          >
            <div className="column-header">
              <h3 className="column-title">{column.title}</h3>
              <span className="task-count">
                {column.taskCount}
              </span>
            </div>

            <div className="column-content">
              {column.tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}

              {column.taskCount === 0 && (
                <div className="empty-column">
                  <p>No tasks in {column.title.toLowerCase()}</p>
                  <p className="drop-hint">Drop tasks here</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(KanbanBoard);
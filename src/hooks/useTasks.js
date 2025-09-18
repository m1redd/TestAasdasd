import { useState, useEffect } from 'react';
import {
  getTasks, saveTasks,
  getActivities, saveActivities,
  getTaskHistories, saveTaskHistories,
  initializeStorage
} from '../utils/localStorage';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [taskHistories, setTaskHistories] = useState({});

  // Initialize data from localStorage on mount
  useEffect(() => {
    initializeStorage();
    setTasks(getTasks());
    setActivities(getActivities());
    setTaskHistories(getTaskHistories());
  }, []);

  const addActivity = (taskTitle, action, user = 'Current User') => {
    const newActivity = {
      taskTitle,
      action,
      user,
      timestamp: new Date().toISOString()
    };
    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);
    saveActivities(updatedActivities);
  };

  const addTaskHistory = (taskId, action, changes = {}, user = 'Current User') => {
    const historyEntry = {
      id: Date.now() + Math.random(),
      action,
      changes,
      user,
      timestamp: new Date().toISOString()
    };

    const updatedHistories = {
      ...taskHistories,
      [taskId]: [historyEntry, ...(taskHistories[taskId] || [])]
    };
    setTaskHistories(updatedHistories);
    saveTaskHistories(updatedHistories);
  };

  const createTask = (task) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    addActivity(task.title, 'created', task.user);
    addTaskHistory(task.id, 'created', {
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignee: task.assignee,
      status: task.status,
      dueDate: task.dueDate
    }, task.user);
  };

  const updateTask = (id, updatedTask, user = 'Current User') => {
    const originalTask = tasks.find(t => t.id === id);

    const updatedTasks = tasks.map(task =>
      task.id === id ? updatedTask : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    if (originalTask) {
      // Track what changed
      const changes = {};
      if (originalTask.title !== updatedTask.title) changes.title = { from: originalTask.title, to: updatedTask.title };
      if (originalTask.description !== updatedTask.description) changes.description = { from: originalTask.description, to: updatedTask.description };
      if (originalTask.priority !== updatedTask.priority) changes.priority = { from: originalTask.priority, to: updatedTask.priority };
      if (originalTask.assignee !== updatedTask.assignee) changes.assignee = { from: originalTask.assignee, to: updatedTask.assignee };
      if (originalTask.status !== updatedTask.status) changes.status = { from: originalTask.status, to: updatedTask.status };
      if (originalTask.dueDate !== updatedTask.dueDate) changes.dueDate = { from: originalTask.dueDate, to: updatedTask.dueDate };

      // Add to history
      if (Object.keys(changes).length > 0) {
        addTaskHistory(id, 'updated', changes, user);
      }

      // Add to activity feed
      if (originalTask.status !== updatedTask.status) {
        if (updatedTask.status === 'Done') {
          addActivity(updatedTask.title, 'completed', user);
        } else {
          addActivity(updatedTask.title, 'updated', user);
        }
      } else if (Object.keys(changes).length > 0) {
        addActivity(updatedTask.title, 'updated', user);
      }
    }
  };

  const deleteTask = (id, user = 'Current User') => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      addActivity(task.title, 'deleted', user);
      addTaskHistory(id, 'deleted', { task: task.title }, user);

      // Clean up task history after deletion
      setTimeout(() => {
        const updatedHistories = { ...taskHistories };
        delete updatedHistories[id];
        setTaskHistories(updatedHistories);
        saveTaskHistories(updatedHistories);
      }, 100);
    }
  };

  const getTaskHistory = (taskId) => {
    return taskHistories[taskId] || [];
  };

  return {
    tasks,
    activities,
    taskHistories,
    createTask,
    updateTask,
    deleteTask,
    getTaskHistory
  };
}
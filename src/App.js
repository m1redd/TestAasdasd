import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import CreateTask from './pages/CreateTask';
import TaskDetail from './pages/TaskDetail';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';
import { useTasks } from './hooks/useTasks';
import { getCurrentUser, logout } from './utils/localStorage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { tasks, activities, createTask, updateTask, deleteTask, getTaskHistory } = useTasks();

  // Check for existing authentication on app load
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  const handleNavigation = (page, taskId = null) => {
    setCurrentPage(page);
    setSelectedTaskId(taskId);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  const handleCreateTask = (task) => {
    // Add the current user to the task
    const taskWithUser = {
      ...task,
      user: currentUser?.name || 'System'
    };
    createTask(taskWithUser);
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={tasks}
            activities={activities}
            onNavigate={handleNavigation}
          />
        );
      case 'tasks':
        return (
          <TaskList
            tasks={tasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onNavigate={handleNavigation}
          />
        );
      case 'create-task':
        return (
          <CreateTask
            onCreateTask={handleCreateTask}
            onNavigate={handleNavigation}
            existingTasks={tasks}
          />
        );
      case 'task-detail':
        return (
          <TaskDetail
            taskId={selectedTaskId}
            tasks={tasks}
            onNavigate={handleNavigation}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onCreateTask={handleCreateTask}
            getTaskHistory={getTaskHistory}
          />
        );
      case 'users':
        return (
          <UserManagement
            tasks={tasks}
            onNavigate={handleNavigation}
          />
        );
      default:
        return (
          <Dashboard
            tasks={tasks}
            activities={activities}
            onNavigate={handleNavigation}
          />
        );
    }
  };

  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <div className="App">
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigation}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <ErrorBoundary>
          <main className="main-content">
            {renderCurrentPage()}
          </main>
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

export default App;

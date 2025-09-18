// localStorage utilities for data persistence
export const STORAGE_KEYS = {
  TASKS: 'taskManager_tasks',
  ACTIVITIES: 'taskManager_activities',
  TASK_HISTORIES: 'taskManager_taskHistories',
  USERS: 'taskManager_users'
};

// Generic localStorage functions
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
    return false;
  }
};

// Tasks functions
export const getTasks = () => {
  return getFromStorage(STORAGE_KEYS.TASKS, []);
};

export const saveTasks = (tasks) => {
  return saveToStorage(STORAGE_KEYS.TASKS, tasks);
};

// Activities functions
export const getActivities = () => {
  return getFromStorage(STORAGE_KEYS.ACTIVITIES, []);
};

export const saveActivities = (activities) => {
  return saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
};

// Task histories functions
export const getTaskHistories = () => {
  return getFromStorage(STORAGE_KEYS.TASK_HISTORIES, {});
};

export const saveTaskHistories = (histories) => {
  return saveToStorage(STORAGE_KEYS.TASK_HISTORIES, histories);
};

// Users functions
export const getUsers = () => {
  const defaultUsers = [
    { id: 1, name: 'John Developer', email: 'john@company.com', role: 'Developer' },
    { id: 2, name: 'Sarah Designer', email: 'sarah@company.com', role: 'Designer' },
    { id: 3, name: 'Mike QA', email: 'mike@company.com', role: 'QA' },
    { id: 4, name: 'Lisa Manager', email: 'lisa@company.com', role: 'Manager' }
  ];

  return getFromStorage(STORAGE_KEYS.USERS, defaultUsers);
};

export const saveUsers = (users) => {
  return saveToStorage(STORAGE_KEYS.USERS, users);
};

// Sample tasks function
const getSampleTasks = () => {
  return [
    {
      id: 1,
      taskId: 'TASK-001',
      title: 'Setup project structure',
      description: 'Initialize project structure with proper folder organization and configuration files',
      status: 'To Do',
      priority: 'High',
      assignee: 'John Developer',
      dueDate: null,
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      user: 'Lisa Manager'
    },
    {
      id: 2,
      taskId: 'TASK-002',
      title: 'Design login page mockup',
      description: 'Create wireframes and visual design for the login page interface',
      status: 'In Progress',
      priority: 'Medium',
      assignee: 'Sarah Designer',
      dueDate: new Date('2024-01-25T23:59:59Z').toISOString(),
      createdAt: new Date('2024-01-16T09:30:00Z').toISOString(),
      updatedAt: new Date('2024-01-18T14:20:00Z').toISOString(),
      user: 'Lisa Manager'
    },
    {
      id: 3,
      taskId: 'TASK-003',
      title: 'Write user authentication tests',
      description: 'Develop comprehensive test cases for user login and registration functionality',
      status: 'To Do',
      priority: 'High',
      assignee: 'Mike QA',
      dueDate: null,
      createdAt: new Date('2024-01-16T11:15:00Z').toISOString(),
      updatedAt: new Date('2024-01-16T11:15:00Z').toISOString(),
      user: 'Lisa Manager'
    },
    {
      id: 4,
      taskId: 'TASK-004',
      title: 'Review sprint planning',
      description: 'Analyze current sprint progress and plan for the next sprint cycle',
      status: 'Done',
      priority: 'Low',
      assignee: 'Lisa Manager',
      dueDate: null,
      createdAt: new Date('2024-01-14T08:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-17T16:45:00Z').toISOString(),
      user: 'Lisa Manager'
    },
    {
      id: 5,
      taskId: 'TASK-005',
      title: 'Implement user registration API',
      description: 'Build backend API endpoints for user registration with validation and security',
      status: 'In Progress',
      priority: 'High',
      assignee: 'John Developer',
      dueDate: new Date('2024-01-30T23:59:59Z').toISOString(),
      createdAt: new Date('2024-01-17T13:20:00Z').toISOString(),
      updatedAt: new Date('2024-01-19T10:30:00Z').toISOString(),
      user: 'Lisa Manager'
    },
    {
      id: 6,
      taskId: 'TASK-006',
      title: 'Create color palette and typography guide',
      description: 'Establish design system with consistent colors, fonts, and styling guidelines',
      status: 'Done',
      priority: 'Medium',
      assignee: 'Sarah Designer',
      dueDate: null,
      createdAt: new Date('2024-01-15T14:45:00Z').toISOString(),
      updatedAt: new Date('2024-01-18T11:20:00Z').toISOString(),
      user: 'Lisa Manager'
    },
    {
      id: 7,
      taskId: 'TASK-007',
      title: 'Setup automated testing pipeline',
      description: 'Configure CI/CD pipeline with automated testing and deployment processes',
      status: 'To Do',
      priority: 'Medium',
      assignee: 'Mike QA',
      dueDate: new Date('2024-02-05T23:59:59Z').toISOString(),
      createdAt: new Date('2024-01-18T16:10:00Z').toISOString(),
      updatedAt: new Date('2024-01-18T16:10:00Z').toISOString(),
      user: 'John Developer'
    },
    {
      id: 8,
      taskId: 'TASK-008',
      title: 'Prepare quarterly review presentation',
      description: 'Compile project metrics and progress data for quarterly stakeholder review',
      status: 'In Progress',
      priority: 'Low',
      assignee: 'Lisa Manager',
      dueDate: new Date('2024-01-31T17:00:00Z').toISOString(),
      createdAt: new Date('2024-01-19T09:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-20T15:30:00Z').toISOString(),
      user: 'Lisa Manager'
    }
  ];
};

// Initialize default data if not exists
export const initializeStorage = () => {
  // Initialize users with default data
  const existingUsers = getFromStorage(STORAGE_KEYS.USERS);
  if (!existingUsers) {
    getUsers(); // This will set defaults
  }

  // Initialize tasks with sample data if not exists
  const existingTasks = getFromStorage(STORAGE_KEYS.TASKS);
  if (!existingTasks || existingTasks.length === 0) {
    saveTasks(getSampleTasks());
  }

  if (!getFromStorage(STORAGE_KEYS.ACTIVITIES)) {
    saveActivities([]);
  }

  if (!getFromStorage(STORAGE_KEYS.TASK_HISTORIES)) {
    saveTaskHistories({});
  }
};

// Add authentication functions
export const STORAGE_KEYS_AUTH = {
  CURRENT_USER: 'taskManager_currentUser'
};

export const getCurrentUser = () => {
  return getFromStorage(STORAGE_KEYS_AUTH.CURRENT_USER);
};

export const setCurrentUser = (user) => {
  return saveToStorage(STORAGE_KEYS_AUTH.CURRENT_USER, user);
};

export const logout = () => {
  return removeFromStorage(STORAGE_KEYS_AUTH.CURRENT_USER);
};

export const authenticateUser = (name, email) => {
  const users = getUsers();
  const user = users.find(u =>
    u.name.toLowerCase() === name.toLowerCase() &&
    u.email.toLowerCase() === email.toLowerCase()
  );
  return user || null;
};
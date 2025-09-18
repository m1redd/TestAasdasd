# Task Manager

A comprehensive task management application built with React.js featuring user authentication, task CRUD operations, and user management.

## Features

- **User Authentication** - Simple name/email authentication system
- **Dashboard** - Statistics and recent activity overview
- **Task Management** - Full CRUD operations for tasks
- **User Management** - CRUD operations for team members
- **Filtering & Search** - Advanced filtering and search capabilities
- **Local Storage** - MVP data persistence using localStorage
- **Form Validation** - Comprehensive client-side validation
- **Responsive Design** - Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React.js, HTML5, CSS3
- **State Management**: React Hooks (useState, useEffect, custom hooks)
- **Data Storage**: localStorage (MVP approach)
- **Routing**: Single Page Application with component-based navigation
- **Styling**: Custom CSS with responsive design

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd task
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

### Demo Users

The application comes with pre-loaded demo users. Click any card on the login page to auto-fill:

- **John Developer** - john@company.com (Developer)
- **Sarah Designer** - sarah@company.com (Designer)
- **Mike QA** - mike@company.com (QA)
- **Lisa Manager** - lisa@company.com (Manager)

### Sample Data

The app includes 8 sample tasks and 4 users to demonstrate all functionality.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navigation.js    # Main navigation bar
│   ├── Statistics.js    # Dashboard statistics
│   └── RecentActivity.js # Recent activity feed
├── pages/               # Main application pages
│   ├── Dashboard.js     # Dashboard overview
│   ├── TaskList.js      # Task list with filtering
│   ├── CreateTask.js    # Task creation form
│   ├── TaskDetail.js    # Task details with editing
│   ├── UserManagement.js # User CRUD operations
│   └── Login.js         # Authentication page
├── hooks/               # Custom React hooks
│   ├── useTasks.js      # Task management logic
│   └── useUsers.js      # User management logic
├── utils/               # Utility functions
│   ├── localStorage.js  # localStorage operations
│   └── users.js         # User utility functions
├── App.js               # Main application component
├── App.css              # Global styles
└── index.js             # Application entry point
```

## Application Pages

### 1. Dashboard
- Task statistics (Total, Completed, In-Progress)
- Recent activity feed (last 5 activities)
- Quick navigation to create tasks

### 2. Task List
- Table view with columns: Task ID, Title, Status, Priority, Assignee, Created Date
- Filter by status: All, To Do, In Progress, Done
- Search functionality (minimum 3 characters)
- Sort by Created Date and Priority
- Click rows to view task details

### 3. Create Task
- Form with validation:
  - Title (1-100 characters, required)
  - Description (max 500 characters, optional)
  - Priority (High/Medium/Low, required)
  - Assignee (from user list, required)
  - Due Date (future dates only, optional)
- Character counters for Title and Description
- Auto-generated unique Task IDs
- Success message with redirect

### 4. Task Detail
- Read-only view with all task information
- Edit mode with form validation
- Status dropdown for quick updates
- Complete task history with change tracking
- Delete confirmation dialog

### 5. User Management
- User table: Name, Email, Role, Assigned Tasks, Actions
- Inline editing functionality
- Add user form with validation:
  - Name (1-50 characters, required)
  - Email (unique, valid format, required)
  - Role (Developer/Designer/QA/Manager, required)
- Delete protection for users with assigned tasks

## Development Roadmap

### ✅ Getting Started (Completed)
- [x] Project structure setup
- [x] Basic React application scaffolding
- [x] Component organization

### ✅ Basic Routing (Completed)
- [x] Single Page Application navigation
- [x] Component-based routing for 5 pages
- [x] Navigation component with active states

### ✅ Data Models and Storage (Completed)
- [x] Task data model (id, taskId, title, description, status, priority, assignee, dates)
- [x] User data model (id, name, email, role)
- [x] localStorage utilities for data persistence
- [x] Sample data initialization

### ✅ Core CRUD Operations (Completed)
- [x] **Tasks**: Create, Read, Update, Delete
- [x] **Users**: Create, Read, Update, Delete
- [x] Task history tracking
- [x] Activity logging
- [x] Data synchronization between components

### ✅ Filtering and Search (Completed)
- [x] Task filtering by status (All, To Do, In Progress, Done)
- [x] Task search by title (minimum 3 characters)
- [x] Task sorting by Created Date and Priority
- [x] User task count display

### ✅ UI Polish and Validation (Completed)
- [x] Responsive design for all screen sizes
- [x] Form validation with error messages
- [x] Character counters and field limits
- [x] Success/error feedback
- [x] Loading states and confirmations
- [x] Consistent styling and branding

### ✅ Testing and Quality (Completed)
- [x] Manual testing of all CRUD operations
- [x] Form validation testing
- [x] Cross-component data flow testing
- [x] localStorage persistence testing
- [x] Responsive design testing

### ✅ Documentation (Completed)
- [x] Comprehensive README
- [x] Code comments and structure
- [x] Setup instructions
- [x] Feature documentation

## Testing the Application

### Manual Testing Checklist

1. **Authentication**
   - [ ] Login with demo users
   - [ ] Session persistence

2. **Task CRUD**
   - [ ] Create new task with validation
   - [ ] View task details
   - [ ] Edit task information
   - [ ] Delete task with confirmation
   - [ ] Status updates

3. **User CRUD**
   - [ ] Create new user with validation
   - [ ] Edit user inline
   - [ ] Delete user (with task protection)
   - [ ] Email uniqueness validation

4. **Filtering & Search**
   - [ ] Filter tasks by status
   - [ ] Search tasks by title
   - [ ] Sort tasks by date/priority

5. **Data Persistence**
   - [ ] Refresh browser - data persists
   - [ ] Cross-component data updates

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner (not implemented)
- `npm run eject` - Ejects from Create React App (not recommended)

## Future Enhancements

- Backend API integration
- JWT authentication with passwords
- Database storage (PostgreSQL/MongoDB)
- Real-time updates with WebSockets
- File attachments for tasks
- Email notifications
- Advanced reporting and analytics
- Team collaboration features

## Notes

This is an MVP implementation using localStorage for data persistence. For production use, consider implementing:
- JWT access tokens for authentication
- Secure password hashing
- Database storage for data persistence
- Input sanitization and server-side validation
- API rate limiting and security measures
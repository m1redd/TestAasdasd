import React, { useState } from 'react';
import { authenticateUser, setCurrentUser } from '../utils/localStorage';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please enter both name and email');
      setIsLoading(false);
      return;
    }

    // Simulate a brief loading delay for better UX
    setTimeout(() => {
      const user = authenticateUser(formData.name.trim(), formData.email.trim());

      if (user) {
        setCurrentUser(user);
        onLogin(user);
      } else {
        setError('Invalid credentials. Please check your name and email.');
      }

      setIsLoading(false);
    }, 500);
  };

  const quickLogin = (user) => {
    setFormData({
      name: user.name,
      email: user.email
    });
  };

  const sampleUsers = [
    { name: 'John Developer', email: 'john@company.com', role: 'Developer' },
    { name: 'Sarah Designer', email: 'sarah@company.com', role: 'Designer' },
    { name: 'Mike QA', email: 'mike@company.com', role: 'QA' },
    { name: 'Lisa Manager', email: 'lisa@company.com', role: 'Manager' }
  ];

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Task Manager</h1>
          <p>Please enter your credentials to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              disabled={isLoading}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-users">
          <h3>Demo Users - Click to auto-fill:</h3>
          <div className="demo-users-grid">
            {sampleUsers.map((user, index) => (
              <div
                key={index}
                className="demo-user-card"
                onClick={() => quickLogin(user)}
              >
                <div className="demo-user-name">{user.name}</div>
                <div className="demo-user-email">{user.email}</div>
                <div className={`demo-user-role role-${user.role.toLowerCase()}`}>
                  {user.role}
                </div>
              </div>
            ))}
          </div>
          <p className="demo-hint">
            💡 Click any card above to automatically fill the login form
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
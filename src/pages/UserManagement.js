import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';

function UserManagement({ tasks, onNavigate }) {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer'
  });
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});

  const roles = ['Developer', 'Designer', 'QA', 'Manager'];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (data, isEdit = false) => {
    const newErrors = {};

    // Name validation
    if (!data.name?.trim()) {
      newErrors.name = 'Name is required';
    } else if (data.name.trim().length > 50) {
      newErrors.name = 'Name must not exceed 50 characters';
    }

    // Email validation
    if (!data.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else {
      // Check for duplicate email
      const existingUser = users.find(user =>
        user.email.toLowerCase() === data.email.toLowerCase() &&
        (!isEdit || user.id !== editingUserId)
      );
      if (existingUser) {
        newErrors.email = 'This email is already taken';
      }
    }

    // Role validation
    if (!roles.includes(data.role)) {
      newErrors.role = 'Please select a valid role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getTaskCount = (userName) => {
    return tasks.filter(task => task.assignee === userName).length;
  };

  const canDeleteUser = (userName) => {
    return getTaskCount(userName) === 0;
  };

  const handleAddUser = (e) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      return;
    }

    addUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role
    });

    // Reset form
    setFormData({ name: '', email: '', role: 'Developer' });
    setShowAddForm(false);
    setErrors({});
  };

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditData({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setErrors({});
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditData({});
    setErrors({});
  };

  const saveEdit = () => {
    if (!validateForm(editData, true)) {
      return;
    }

    updateUser(editingUserId, {
      name: editData.name.trim(),
      email: editData.email.trim(),
      role: editData.role
    });

    setEditingUserId(null);
    setEditData({});
    setErrors({});
  };

  const handleDelete = (user) => {
    if (!canDeleteUser(user.name)) {
      alert(`Cannot delete ${user.name} because they have assigned tasks. Please reassign or complete their tasks first.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
      deleteUser(user.id);
    }
  };

  const cancelAddForm = () => {
    setShowAddForm(false);
    setFormData({ name: '', email: '', role: 'Developer' });
    setErrors({});
  };

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1>User Management</h1>
        <button
          className="add-user-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-user-section">
          <div className="add-user-form">
            <h3>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="add-name">Name *</label>
                  <input
                    type="text"
                    id="add-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name (1-50 characters)"
                    maxLength={50}
                    className={errors.name ? 'error' : ''}
                  />
                  <div className="field-info">
                    <span className="char-count">{formData.name.length}/50</span>
                  </div>
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="add-email">Email *</label>
                  <input
                    type="email"
                    id="add-email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="add-role">Role *</label>
                  <select
                    id="add-role"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className={errors.role ? 'error' : ''}
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {errors.role && <div className="error-message">{errors.role}</div>}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="add-button">Add User</button>
                <button type="button" className="cancel-button" onClick={cancelAddForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Assigned Tasks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="user-row">
                {editingUserId === user.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className={`inline-edit ${errors.name ? 'error' : ''}`}
                        maxLength={50}
                      />
                      {errors.name && <div className="inline-error">{errors.name}</div>}
                    </td>
                    <td>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className={`inline-edit ${errors.email ? 'error' : ''}`}
                      />
                      {errors.email && <div className="inline-error">{errors.email}</div>}
                    </td>
                    <td>
                      <select
                        value={editData.role}
                        onChange={(e) => setEditData({...editData, role: e.target.value})}
                        className={`inline-edit ${errors.role ? 'error' : ''}`}
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      {errors.role && <div className="inline-error">{errors.role}</div>}
                    </td>
                    <td>{getTaskCount(user.name)}</td>
                    <td>
                      <div className="inline-actions">
                        <button className="save-inline-button" onClick={saveEdit}>Save</button>
                        <button className="cancel-inline-button" onClick={cancelEditing}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="user-name">{user.name}</td>
                    <td className="user-email">{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className="task-count">
                        {getTaskCount(user.name)}
                        {getTaskCount(user.name) > 0 && (
                          <span className="has-tasks-indicator">📝</span>
                        )}
                      </span>
                    </td>
                    <td>
                      <div className="user-actions">
                        <button
                          className="edit-user-button"
                          onClick={() => startEditing(user)}
                        >
                          Edit
                        </button>
                        <button
                          className={`delete-user-button ${!canDeleteUser(user.name) ? 'disabled' : ''}`}
                          onClick={() => handleDelete(user)}
                          disabled={!canDeleteUser(user.name)}
                          title={!canDeleteUser(user.name) ? 'Cannot delete user with assigned tasks' : 'Delete user'}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="no-users">
            <p>No users found. Add your first user to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
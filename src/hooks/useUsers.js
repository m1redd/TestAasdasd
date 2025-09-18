import { useState, useEffect } from 'react';
import { getUsers, saveUsers } from '../utils/localStorage';

export function useUsers() {
  const [users, setUsers] = useState([]);

  // Load users from localStorage on mount
  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const addUser = (user) => {
    const newUser = {
      ...user,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    return newUser;
  };

  const updateUser = (id, updatedUser) => {
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, ...updatedUser, updatedAt: new Date().toISOString() } : user
    );
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const deleteUser = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const getUserById = (id) => {
    return users.find(user => user.id === id);
  };

  const refreshUsers = () => {
    const freshUsers = getUsers();
    setUsers(freshUsers);
    return freshUsers;
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    refreshUsers
  };
}
import { getUsers } from './localStorage';

// Get users from localStorage
export const availableUsers = getUsers();

export const getUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUserByName = (name) => {
  const users = getUsers();
  return users.find(user => user.name === name);
};

export const refreshUsers = () => {
  return getUsers();
};
import { User } from '../types/user';

export const fetchUserData = async (username: string): Promise<User> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Couldn\'t find any session. Please login.');
  }

  const response = await fetch(`/api/v1/users/${encodeURIComponent(username)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Unauthorized access. Session invalid.');
    }
    throw new Error('Couldn\'t find user.');
  }

  const data: User = await response.json();
  return data;
};
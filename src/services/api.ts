import { User } from '../types/user';

export const fetchUserData = async (username: string): Promise<User> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
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
      throw new Error('Yetkisiz erişim. Oturumunuzun süresi dolmuş olabilir.');
    }
    throw new Error('Kullanıcı bulunamadı.');
  }

  // Dönen JSON'ı User tipine cast ediyoruz
  const data: User = await response.json();
  return data;
};
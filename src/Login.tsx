import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username || !password) {
      setErrorMessage('Lütfen kullanıcı adı ve şifre giriniz.');
      return;
    }

    try {
      setLoading(true);

      // Ingress üzerindeki /api yönlendirmesini kullanarak Spring Boot backend'e istek atıyoruz
      const response = await axios.post('/api/auth/login', {
        username: username,
        password: password
      });

      // Backend'den gelen JWT Token'ı saklıyoruz
      const { token } = response.data;
      localStorage.setItem('token', token);

      // Başarılı giriş sonrası Dashboard'a yönlendirme
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      // 401 Unauthorized veya hatalı giriş durumu
      if (error.response && error.response.status === 401) {
        setErrorMessage('Kullanıcı adı veya şifre hatalı!');
      } else {
        setErrorMessage('Sunucuya bağlanırken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '360px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Giriş Yap</h2>

      {errorMessage && (
        <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Kullanıcı Adı:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
};

export default Login;
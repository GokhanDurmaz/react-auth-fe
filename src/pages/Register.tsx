import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill all form inputs!');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords are not matched!');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response && error.response.status === 409) {
        setErrorMessage('This email is used!');
      } else {
        setErrorMessage('Server error occured in the registration!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '380px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Register</h2>

      {errorMessage && (
        <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '15px' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>E-mail:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Re-confirmation password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
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
            backgroundColor: loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '15px'
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div style={{ textAlign: 'center', fontSize: '14px' }}>
        Is there already an account? <Link to="/login">Signin</Link>
      </div>
    </div>
  );
};

export default Register;
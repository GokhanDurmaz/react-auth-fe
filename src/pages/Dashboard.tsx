import React from 'react';

export const Dashboard: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    
    window.location.replace('/login');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Dashboard Page</h1>
      <p>Welcome! This workplace is safe.</p>
      <button 
        onClick={handleLogout}
        style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
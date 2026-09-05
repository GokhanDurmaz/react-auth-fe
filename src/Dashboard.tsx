import React from 'react';

export const Dashboard: React.FC = () => {
  const handleLogout = () => {
    // Token'ı sil
    localStorage.removeItem('token');
    
    // Geçmişten /dashboard adresini silip /login adresine yönlendir
    window.location.replace('/login');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Dashboard Sayfası</h1>
      <p>Hoş geldiniz! Bu korumalı bir alandır.</p>
      <button 
        onClick={handleLogout}
        style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Çıkış Yap
      </button>
    </div>
  );
};

export default Dashboard;
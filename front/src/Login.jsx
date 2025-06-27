import React, { useState } from 'react';
import { email } from 'react-admin';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Identifiants invalides');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>Utilisateur</label><br/>
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Mot de passe</label><br/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
    </form>
  );
}

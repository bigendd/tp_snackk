import React, { useState, useEffect } from 'react';
import { Admin, Resource } from 'react-admin';
import authProvider from './authProvider';
import dataProvider from './dataProvider';
import Login from './Login';
import Register from './Register';
import { ProduitList } from './ProduitList';
import { ProduitCreate } from './ProduitCreate';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [dp, setDp] = useState(null);

  useEffect(() => {
    setDp(dataProvider);
  }, []);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return showRegister ? (
      <>
        <Register onRegisterSuccess={() => setShowRegister(false)} />
        <p>
          Déjà un compte ?{' '}
          <button onClick={() => setShowRegister(false)}>Connectez-vous</button>
        </p>
      </>
    ) : (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />
        <p>
          Pas de compte ?{' '}
          <button onClick={() => setShowRegister(true)}>Inscrivez-vous</button>
        </p>
      </>
    );
  }

  if (!dp) {
    return <p>Chargement du dataProvider...</p>;
  }

  return (
    <Admin dataProvider={dp} authProvider={authProvider}>
      <Resource name="produits" list={ProduitList} create={ProduitCreate} />
    </Admin>
  );
}

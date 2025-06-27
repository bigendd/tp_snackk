import React, { useState, useEffect } from 'react';
import { Admin, Resource } from 'react-admin';
import { authProvider, httpClient } from './authProvider';
import { hydraDataProvider } from '@api-platform/admin';
import Login from './Login';
import Register from './Register';
import { ProduitList } from './ProduitList';
import { ProduitCreate } from './ProduitCreate';

const API_URL = 'http://localhost:8080/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [dataProvider, setDataProvider] = useState(null);

  // Créer le dataProvider une seule fois
  useEffect(() => {
    const initializeDataProvider = async () => {
      try {
        console.log('Initializing dataProvider with API_URL:', API_URL);
        
        // Créer le dataProvider avec l'URL complète
        const dp = await hydraDataProvider({
          entrypoint: API_URL,
          httpClient: httpClient,
          apiDocumentationUrl: `${API_URL}/docs.json`, // Optionnel
        });
        
        setDataProvider(dp);
        console.log('DataProvider initialized successfully');
      } catch (error) {
        console.error('Error initializing dataProvider:', error);
      }
    };

    initializeDataProvider();
  }, []);

  // Vérifier l'authentification au montage
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fonction pour gérer le succès de connexion
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Interface de connexion/inscription
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

  // Attendre que le dataProvider soit prêt
  if (!dataProvider) {
    return <p>Chargement du dataProvider...</p>;
  }

  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="produits" list={ProduitList} create={ProduitCreate} />
    </Admin>
  );
}
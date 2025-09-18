import React, { useState } from 'react';
import {  Link } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
//   const navigate = useNavigate();

//   if (user) {
//     navigate('/');
//     return null;
//   }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white">
          Se connecter
        </h2>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:text-red-400 dark:bg-red-900/50">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div>
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mot de passe
              </label>
              {/* Le lien pour le mot de passe oublié */}
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-500"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-yellow-400 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
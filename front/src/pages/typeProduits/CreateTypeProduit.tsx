// src/pages/typeProduits/CreateTypeProduit.tsx
import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { useAuth } from '../../store/useAuth';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CreateTypeProduit() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) {
    navigate('/login'); // redirige si pas connecté
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(
        '/type_produits', // ⚡ .json obligatoire pour API Platform
        { nom },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/ld+json',
          },
        }
      );
      setSuccess('Type de produit créé avec succès !');
      setNom('');
      setError('');
      navigate('/types'); // ou la route liste des types
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.hydra?.description || 'Erreur lors de la création.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        elevation={6}
      >
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          Créer un type de produit
        </Typography>

        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom du type de produit"
            variant="outlined"
            fullWidth
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            sx={{ mb: 2 }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: '#646cff',
              '&:hover': { backgroundColor: '#535bf2' },
            }}
          >
            {loading ? 'Création...' : 'Créer'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

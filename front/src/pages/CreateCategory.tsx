// src/pages/CreateCategory.tsx
import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Switch, FormControlLabel } from "@mui/material";
import { useAuth } from "../store/useAuth";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateCategory() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!token) {
    navigate("/login"); // redirige si pas connecté
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/categories",
        { nom, disponible },
        { headers: { Authorization: `Bearer ${token}`,
        'Content-Type': 'application/ld+json'
     } }
      );
      setSuccess("Catégorie créée avec succès !");
      setNom("");
      setDisponible(true);
      setError("");
      navigate("/"); 
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la création.");
      setSuccess("");
    }
    
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        sx={{ p: 4, maxWidth: 500, width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
        elevation={6}
      >
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Créer une catégorie
        </Typography>

        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom de la catégorie"
            variant="outlined"
            fullWidth
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={disponible}
                onChange={(e) => setDisponible(e.target.checked)}
              />
            }
            label="Disponible"
            sx={{ mb: 3 }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#646cff", "&:hover": { backgroundColor: "#535bf2" } }}>
            Créer
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

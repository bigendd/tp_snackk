// src/pages/categoryingredient/CreateCategoryIngredient.tsx
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import api from "../../api/axios";

export default function CreateCategoryIngredient() {
  const [nom, setNom] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return setError("Le nom est obligatoire");

    try {
      await api.post("/categorie_ingredients", { nom }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/ld+json" },
      });

      setSuccess("Catégorie créée avec succès !");
      setNom("");
      setError("");
      navigate("/categoryingredient");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la création");
      setSuccess("");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mt: 4 }}>
      <Typography variant="h4" mb={3}>Créer une catégorie d'ingrédients</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success.main">{success}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Créer
        </Button>
      </form>
    </Box>
  );
}

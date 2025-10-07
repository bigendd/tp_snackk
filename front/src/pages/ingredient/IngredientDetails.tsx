import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../store/useAuth";

interface Ingredient {
  id: number;
  nom: string;
  disponible: boolean;
  estSupplement: boolean;
  prixSupplement?: number | null;
  produit?: { id: number; nom: string };
  categorie?: { id: number; nom: string };
}

export default function IngredientDetail() {
  const { id } = useParams<{ id: string }>();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token || !id) return;
    api.get(`/ingredients/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setIngredient(res.data))
      .catch(err => console.error(err));
  }, [token, id]);

  if (!ingredient) return <Typography>Chargement...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>{ingredient.nom}</Typography>
      <Typography>Disponible: {ingredient.disponible ? "Oui" : "Non"}</Typography>
      <Typography>Supplément: {ingredient.estSupplement ? "Oui" : "Non"}</Typography>
      {ingredient.estSupplement && <Typography>Prix supplément: {ingredient.prixSupplement ?? 0} €</Typography>}
      <Typography>Catégorie: {ingredient.categorie?.nom || "-"}</Typography>
      <Typography>Produit lié: {ingredient.produit?.nom || "Aucun"}</Typography>
    </Box>
  );
}

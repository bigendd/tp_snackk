// src/pages/categories/CategoryDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import api from "../../api/axios";

interface Category {
  id: number;
  nom: string;
  disponible: boolean;
  createdAt: string;
  produit?: any[]; // tu peux détailler le type si tu veux
}

export default function CategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .get(`/categories/${id}`)
      .then((res) => {
        setCategory({
          id: res.data.id,
          nom: res.data.nom,
          disponible: res.data.disponible,
          createdAt: res.data.createdAt,
          produit: res.data.produit,
        });
      })
      .catch((err) => setError("Impossible de charger la catégorie"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => navigate("/categories")}>
          Retour
        </Button>
      </Box>
    );
  }

  if (!category) return null;

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="contained" onClick={() => navigate("/categories")} sx={{ mb: 3 }}>
        Retour aux catégories
      </Button>

      <Typography variant="h4" gutterBottom>
        Détails de la catégorie
      </Typography>

      <Typography variant="body1">
        <strong>ID :</strong> {category.id}
      </Typography>
      <Typography variant="body1">
        <strong>Nom :</strong> {category.nom}
      </Typography>
      <Typography variant="body1">
        <strong>Disponible :</strong> {category.disponible ? "Oui" : "Non"}
      </Typography>
      <Typography variant="body1">
        <strong>Créé le :</strong>{" "}
        {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : ""}
      </Typography>

      <Typography variant="h6" sx={{ mt: 3 }}>
        Produits associés
      </Typography>
      {category.produit && category.produit.length > 0 ? (
        <ul>
          {category.produit.map((p, idx) => (
            <li key={idx}>{p.nom}</li>
          ))}
        </ul>
      ) : (
        <Typography>Aucun produit associé</Typography>
      )}
    </Box>
  );
}

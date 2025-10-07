// src/pages/categoryingredient/CategoryIngredientDetails.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import api from "../../api/axios";

interface Ingredient {
  id: number;
  nom: string;
}

interface CategoryIngredient {
  id: number;
  nom: string;
  ingredients?: Ingredient[];
}

export default function CategoryIngredientDetails() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<CategoryIngredient | null>(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    api.get(`/categorie_ingredients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setCategory(res.data))
      .catch((err) => console.error(err));
  }, [id, token, navigate]);

  if (!category) return <Typography>Chargement...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mt: 4 }}>
      <Typography variant="h4" mb={2}>{category.nom}</Typography>
      <Typography variant="h6" mb={1}>Ingrédients associés :</Typography>
      <List>
        {category.ingredients?.length
          ? category.ingredients.map((ing) => (
              <ListItem key={ing.id}>
                <ListItemText primary={ing.nom} />
              </ListItem>
            ))
          : <Typography>Aucun ingrédient associé.</Typography>}
      </List>
      <Button component={Link} to="/categoryingredient" variant="contained" sx={{ mt: 2 }}>
        Retour à la liste
      </Button>
    </Box>
  );
}

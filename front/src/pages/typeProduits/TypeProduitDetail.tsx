import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, List, ListItem } from "@mui/material";
import api from "../../api/axios";

interface TypeProduit {
  id: number;
  nom: string;
  produits?: { id: number; nom: string }[];
}

export default function TypeProduitDetail() {
  const { id } = useParams<{ id: string }>();
  const [type, setType] = useState<TypeProduit | null>(null);

  useEffect(() => {
    api.get(`/type_produits/${id}`)
      .then(res => setType(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!type) return <Box sx={{ p: 4 }}>Chargement...</Box>;

  return (
    <Box sx={{ p: 4, width: "100%", maxWidth: 600 }}>
      <Typography variant="h4" mb={2}>{type.nom}</Typography>
      <Typography variant="h6">Produits associés :</Typography>
      <List>
        {type.produits && type.produits.length > 0 ? (
          type.produits.map(p => (
            <ListItem key={p.id}>{p.nom}</ListItem>
          ))
        ) : (
          <ListItem>Aucun produit</ListItem>
        )}
      </List>
    </Box>
  );
}

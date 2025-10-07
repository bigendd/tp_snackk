// src/pages/CreateProduit.tsx
import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, MenuItem } from "@mui/material";
import api from "../../api/axios";

interface Category {
  id: number;
  nom: string;
}

interface TypeProduit {
  id: number;
  nom: string;
}

export default function CreateProduit() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prixBase, setPrixBase] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<TypeProduit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [selectedType, setSelectedType] = useState<number | "">("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Récupération du token depuis localStorage
  const token = localStorage.getItem("token"); // ou useAuth si tu as un store

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Récupérer catégories et types depuis API
    api.get("/categories", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      const cats = Array.isArray(res.data.member) ? res.data.member : res.data;
      setCategories(cats.map((c: any) => ({ id: c.id, nom: c.nom })));
    }).catch(err => console.error(err));

    api.get("/type_produits", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      const tps = Array.isArray(res.data.member) ? res.data.member : res.data;
      setTypes(tps.map((t: any) => ({ id: t.id, nom: t.nom })));
    }).catch(err => console.error(err));

  }, [token, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nom || !prixBase || !selectedCategory || !selectedType) {
      setError("Tous les champs obligatoires doivent être remplis");
      return;
    }

    try {
      await api.post("/produits",
        {
          nom,
          description,
          prix_base: parseFloat(prixBase),
          disponible,
          image: image || null,
          category: `/api/categories/${selectedCategory}`,
          type: `/api/type_produits/${selectedType}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/ld+json",
          },
        }
      );

      setSuccess("Produit créé avec succès !");
      setNom("");
      setDescription("");
      setPrixBase("");
      setDisponible(true);
      setImage("");
      setSelectedCategory("");
      setSelectedType("");
      setError("");
      navigate("/produits");

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la création du produit");
      setSuccess("");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mt: 4 }}>
      <Typography variant="h4" mb={3}>Créer un produit</Typography>
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
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />
        <TextField
          label="Prix de base"
          type="number"
          value={prixBase}
          onChange={(e) => setPrixBase(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          select
          label="Disponible"
          value={disponible ? "1" : "0"}
          onChange={(e) => setDisponible(e.target.value === "1")}
          fullWidth
          margin="normal"
        >
          <MenuItem value="1">Oui</MenuItem>
          <MenuItem value="0">Non</MenuItem>
        </TextField>
        <TextField
          label="Image (URL)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Catégorie"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
          fullWidth
          required
          margin="normal"
        >
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.nom}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Type de produit"
          value={selectedType}
          onChange={(e) => setSelectedType(Number(e.target.value))}
          fullWidth
          required
          margin="normal"
        >
          {types.map((t) => (
            <MenuItem key={t.id} value={t.id}>{t.nom}</MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, backgroundColor: "#646cff", "&:hover": { backgroundColor: "#535bf2" } }}
        >
          Créer le produit
        </Button>
      </form>
    </Box>
  );
}

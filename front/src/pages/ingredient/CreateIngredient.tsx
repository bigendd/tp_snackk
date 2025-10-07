// src/pages/ingredient/CreateIngredient.tsx
import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import api from "../../api/axios";

interface CategorieIngredient {
  id: number;
  nom: string;
}

interface Produit {
  id: number;
  nom: string;
}

export default function CreateIngredient() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [estSupplement, setEstSupplement] = useState(false);
  const [prixSupplement, setPrixSupplement] = useState("");
  const [categories, setCategories] = useState<CategorieIngredient[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [selectedCategorie, setSelectedCategorie] = useState<number | "">("");
  const [selectedProduit, setSelectedProduit] = useState<number | "">("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Récupérer catégories d'ingrédients
    api.get("/categorie_ingredients", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const raw = Array.isArray(res.data.member) ? res.data.member : Array.isArray(res.data) ? res.data : [];
        setCategories(raw);
      })
      .catch(err => console.error(err));

    // Récupérer produits
    api.get("/produits", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const raw = Array.isArray(res.data.member) ? res.data.member : Array.isArray(res.data) ? res.data : [];
        setProduits(raw);
      })
      .catch(err => console.error(err));
  }, [token, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nom || !selectedCategorie || !selectedProduit) {
      setError("Tous les champs obligatoires doivent être remplis");
      return;
    }

    try {
      await api.post("/ingredients",
        {
          nom,
          disponible,
          estSupplement,
          prixSupplement: prixSupplement === "" ? null : parseFloat(prixSupplement),
          categorie: `/api/categorie_ingredients/${selectedCategorie}`,
          produit: `/api/produits/${selectedProduit}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/ld+json",
          },
        }
      );

      setSuccess("Ingrédient créé avec succès !");
      setNom("");
      setDisponible(true);
      setEstSupplement(false);
      setPrixSupplement("");
      setSelectedCategorie("");
      setSelectedProduit("");
      setError("");
      navigate("/ingredients");

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.hydra?.description || "Erreur lors de la création de l'ingrédient");
      setSuccess("");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mt: 4 }}>
      <Typography variant="h4" mb={3}>Créer un ingrédient</Typography>
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
          select
          label="Catégorie"
          value={selectedCategorie}
          onChange={(e) => setSelectedCategorie(Number(e.target.value))}
          fullWidth
          required
          margin="normal"
        >
          {categories.map(c => (
            <MenuItem key={c.id} value={c.id}>{c.nom}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Produit"
          value={selectedProduit}
          onChange={(e) => setSelectedProduit(Number(e.target.value))}
          fullWidth
          required
          margin="normal"
        >
          {produits.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.nom}</MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={<Checkbox checked={disponible} onChange={e => setDisponible(e.target.checked)} />}
          label="Disponible"
        />
        <FormControlLabel
          control={<Checkbox checked={estSupplement} onChange={e => setEstSupplement(e.target.checked)} />}
          label="Supplément"
        />

        <TextField
          label="Prix supplément"
          type="number"
          value={prixSupplement}
          onChange={e => setPrixSupplement(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, backgroundColor: "#646cff", "&:hover": { backgroundColor: "#535bf2" } }}
        >
          Créer l'ingrédient
        </Button>
      </form>
    </Box>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, Typography, Card, CardContent, CardMedia, Divider, Button, TextField, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl 
} from "@mui/material";
import api from "../../api/axios";

interface Category {
  id: number;
  nom: string;
}

interface TypeProduit {
  id: number;
  nom: string;
}

interface Product {
  id: number;
  nom: string;
  description?: string;
  prix_base: number;
  disponible: boolean;
  created_at: string;
  image?: string;
  category?: Category;
  type?: TypeProduit;
}

export default function ProduitDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<TypeProduit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    api.get(`/produits/${id}`)
      .then((res) => {
        const prod = res.data;
        setProduct({
          id: prod.id,
          nom: prod.nom,
          description: prod.description,
          prix_base: prod.prix_base,
          disponible: prod.disponible,
          created_at: prod.createdAt || prod.created_at,
          image: prod.image,
          category: prod.category ? { id: prod.category.id, nom: prod.category.nom } : undefined,
          type: prod.type ? { id: prod.type.id, nom: prod.type.nom } : undefined,
        });
        setForm({
          nom: prod.nom,
          description: prod.description,
          prix_base: prod.prix_base,
          disponible: prod.disponible,
          category: prod.category,
          type: prod.type,
          image: prod.image,
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Récupérer les catégories et types pour les select
  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data)).catch(err => console.error(err));
    api.get("/type_produits").then(res => setTypes(res.data)).catch(err => console.error(err));
  }, []);

  if (!product) return <Typography sx={{ mt: 4 }}>Chargement...</Typography>;

  const handleSave = () => {
    if (!product) return;

    const payload = {
      nom: form.nom,
      description: form.description || null,
      prix_base: form.prix_base,
      disponible: form.disponible,
      category: form.category ? `/api/categories/${form.category.id}` : null,
      type: form.type ? `/api/type_produits/${form.type.id}` : null,
      image: form.image || null,
    };

    api.put(`/produits/${product.id}`, payload, {
      headers: { "Content-Type": "application/json" },
    })
      .then(res => {
        setProduct({ ...product, ...form });
        setEditMode(false);
      })
      .catch(err => console.error(err));
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mt: 4, mx: "auto", p: 2 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Retour
      </Button>

      <Card>
        {product.image && (
          <CardMedia
            component="img"
            height="300"
            image={product.image}
            alt={product.nom}
            sx={{ objectFit: "cover" }}
          />
        )}
        <CardContent>
          {editMode ? (
            <>
              <TextField
                label="Nom"
                fullWidth
                sx={{ mb: 2 }}
                value={form.nom || ""}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <TextField
                label="Prix"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                value={form.prix_base || 0}
                onChange={(e) => setForm({ ...form, prix_base: parseFloat(e.target.value) })}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.disponible || false}
                    onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
                  />
                }
                label="Disponible"
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={form.category?.id || ""}
                  label="Catégorie"
                  onChange={(e) => {
                    const cat = categories.find(c => c.id === Number(e.target.value));
                    setForm({ ...form, category: cat });
                  }}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.nom}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={form.type?.id || ""}
                  label="Type"
                  onChange={(e) => {
                    const t = types.find(t => t.id === Number(e.target.value));
                    setForm({ ...form, type: t });
                  }}
                >
                  {types.map(t => (
                    <MenuItem key={t.id} value={t.id}>{t.nom}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Image URL"
                fullWidth
                sx={{ mb: 2 }}
                value={form.image || ""}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />

              <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
                Enregistrer
              </Button>
              <Button variant="outlined" onClick={() => setEditMode(false)}>
                Annuler
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                {product.nom}
              </Typography>
              {product.description && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1"><strong>Prix :</strong> {product.prix_base.toFixed(2)} €</Typography>
              <Typography variant="body1"><strong>Disponible :</strong> {product.disponible ? "Oui" : "Non"}</Typography>
              {product.category && <Typography variant="body1"><strong>Catégorie :</strong> {product.category.nom}</Typography>}
              {product.type && <Typography variant="body1"><strong>Type :</strong> {product.type.nom}</Typography>}
              <Typography variant="body1"><strong>Créé le :</strong> {new Date(product.created_at).toLocaleDateString()}</Typography>

              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setEditMode(true)}>
                Modifier
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

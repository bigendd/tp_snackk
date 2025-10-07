import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../../api/axios";

interface Produit {
  id: number;
  nom: string;
}

interface Categorie {
  id: number;
  nom: string;
  produit: Produit[];
}

interface Ingredient {
  id: number;
  nom: string;
  disponible: boolean;
  estSupplement: boolean;
  prixSupplement: number;
  categorie: { id: number; nom: string };
}

interface ProduitSelectionne {
  produit: Produit;
  ingredients: number[];
}

export default function ChoixCategorieProduit() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [selectedCategorie, setSelectedCategorie] = useState<Categorie | null>(null);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
  const [ingredientsParType, setIngredientsParType] = useState<Record<string, Ingredient[]>>({});
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);

  const [produitsCommande, setProduitsCommande] = useState<ProduitSelectionne[]>([]);

  // Paiement
  const [openPaiement, setOpenPaiement] = useState(false);
  const [modeCons, setModeCons] = useState<string | null>(null);
  const [moyenPaiement, setMoyenPaiement] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 2000);
  };

  // Charger les catégories
  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        const raw = Array.isArray(res.data.member) ? res.data.member : res.data;
        const formatted = Array.isArray(raw) ? raw : [raw];

        const categoriesData: Categorie[] = formatted.map((c: any) => ({
          id: c.id ?? parseInt(c["@id"]?.split("/").pop() || "0"),
          nom: c.nom,
          produit: Array.isArray(c.produit)
            ? c.produit.map((p: any) => ({
                id: p.id ?? parseInt(p["@id"]?.split("/").pop() || "0"),
                nom: p.nom,
              }))
            : [],
        }));

        setCategories(categoriesData);
      })
      .catch((err) => console.error("Erreur de chargement des catégories:", err));
  }, []);

  const handleCategorieClick = (cat: Categorie) => {
    setSelectedCategorie(cat);
    setProduits(cat.produit);
    setSelectedProduit(null);
    setIngredientsParType({});
    setSelectedIngredients([]);
  };

  const handleProduitClick = async (prod: Produit) => {
    setSelectedProduit(prod);
    setIngredientsParType({});
    setSelectedIngredients([]);
    setLoadingIngredients(true);

    try {
      const res = await api.get(`/ingredients?produit.id=${prod.id}`);
      const ingredients = res.data.member || [];

      const grouped: Record<string, Ingredient[]> = {};
      ingredients.forEach((ing: any) => {
        const type = ing.categorie?.nom || "Autres";
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push({
          id: ing.id,
          nom: ing.nom,
          disponible: ing.disponible ?? true,
          estSupplement: ing.estSupplement ?? false,
          prixSupplement: ing.prixSupplement ?? 0,
          categorie: { id: ing.categorie?.id ?? 0, nom: type },
        });
      });

      setIngredientsParType(grouped);
    } catch (err) {
      console.error("Erreur chargement ingrédients:", err);
    } finally {
      setLoadingIngredients(false);
    }
  };

  const toggleIngredient = (id: number) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAjouterProduitCommande = () => {
    if (!selectedProduit) return;

    setProduitsCommande((prev) => [
      ...prev,
      { produit: selectedProduit, ingredients: selectedIngredients },
    ]);

    setSelectedProduit(null);
    setIngredientsParType({});
    setSelectedIngredients([]);
    setSelectedCategorie(null);
  };

  const handleValiderCommande = () => {
    if (produitsCommande.length === 0) {
      showSnackbar("Ajoutez au moins un produit à la commande.", "error");
      return;
    }
    setOpenPaiement(true);
  };

 const handlePaiement = async () => {
  if (!modeCons || !moyenPaiement || produitsCommande.length === 0) return;

  setIsPaying(true);

  try {
    const body = {
      mode_cons: modeCons,
      moyen_paiment: moyenPaiement,
      commandeProduits: produitsCommande.map((p) => ({
        produit: `/api/produits/${p.produit.id}`,
        quantite: 1,
        ingredientsChoisis: p.ingredients.map((id) => `/api/ingredients/${id}`),
      })),
    };

    console.log("Body envoyé:", JSON.stringify(body, null, 2)); // Pour déboguer

    await api.post("/commandes", body, {
      headers: { "Content-Type": "application/ld+json" },
    });

    // Reset complet
    setOpenPaiement(false);
    setSelectedCategorie(null);
    setSelectedProduit(null);
    setIngredientsParType({});
    setSelectedIngredients([]);
    setProduitsCommande([]);
    setModeCons(null);
    setMoyenPaiement(null);

    showSnackbar("Commande passée avec succès !", "success");
  } catch (err: any) {
    console.error("Erreur lors du paiement:", err);
    showSnackbar("Erreur lors du paiement.", "error");
  } finally {
    setIsPaying(false);
  }
};

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3} textAlign="center">
        Choisis une catégorie
      </Typography>

      {/* Catégories */}
      <Grid container spacing={2} justifyContent="center" mb={4}>
        {categories.map((cat) => (
          <Grid item key={cat.id}>
            <Button
              variant={selectedCategorie?.id === cat.id ? "contained" : "outlined"}
              onClick={() => handleCategorieClick(cat)}
              color="primary"
              sx={{ minWidth: 150, minHeight: 60, textTransform: "capitalize" }}
            >
              {cat.nom}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Produits */}
      {selectedCategorie && (
        <>
          <Typography variant="h5" mb={2} textAlign="center">
            Produits dans "{selectedCategorie.nom}"
          </Typography>
          <Grid container spacing={2} justifyContent="center" mb={4}>
            {produits.map((prod) => (
              <Grid item key={prod.id}>
                <Button
                  variant={selectedProduit?.id === prod.id ? "contained" : "outlined"}
                  color="secondary"
                  onClick={() => handleProduitClick(prod)}
                  sx={{ minWidth: 150, minHeight: 60, textTransform: "capitalize" }}
                >
                  {prod.nom}
                </Button>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Ingrédients */}
      {/* Ingrédients et bouton Ajouter */}
{selectedProduit && !loadingIngredients && (
  <Box>
    {/* Affichage des ingrédients uniquement s'il y en a */}
    {Object.keys(ingredientsParType).length > 0 && (
      <>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h5" textAlign="center" mb={2}>
          Ingrédients pour "{selectedProduit.nom}"
        </Typography>

        {Object.entries(ingredientsParType).map(([type, ingredients]) => (
          <Box key={type} sx={{ mb: 3 }}>
            <Typography variant="h6" mb={1}>
              {type}
            </Typography>
            <Grid container spacing={1}>
              {ingredients.map((ing) => {
                const selected = selectedIngredients.includes(ing.id);
                return (
                  <Grid item key={ing.id}>
                    <Button
                      variant={selected ? "contained" : "outlined"}
                      color={selected ? "success" : "inherit"}
                      disabled={!ing.disponible}
                      onClick={() => toggleIngredient(ing.id)}
                      sx={{ textTransform: "capitalize", minWidth: 120 }}
                    >
                      {ing.nom}
                      {ing.estSupplement && (
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          +{ing.prixSupplement.toFixed(2)}€
                        </Typography>
                      )}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))}
      </>
    )}

    {/* Bouton Ajouter toujours visible */}
    <Box textAlign="center" mt={4}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleAjouterProduitCommande}
      >
        Ajouter ce produit à la commande
      </Button>
    </Box>
  </Box>
)}


      {/* Bouton Valider commande */}
      {produitsCommande.length > 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6">
            {produitsCommande.length} produit(s) dans la commande
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={handleValiderCommande}
            sx={{ mt: 2 }}
          >
            Valider et passer au paiement
          </Button>
        </Box>
      )}

      {/* Popup Paiement */}
      <Dialog open={openPaiement} onClose={() => setOpenPaiement(false)}>
        <DialogTitle>Paiement</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" mt={2}>
            Mode de consommation :
          </Typography>
          <ToggleButtonGroup
            value={modeCons}
            exclusive
            onChange={(_, val) => setModeCons(val)}
            sx={{ mt: 1 }}
          >
            <ToggleButton value="sur_place">Sur place</ToggleButton>
            <ToggleButton value="a_emporter">À emporter</ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="subtitle1" mt={3}>
            Moyen de paiement :
          </Typography>
          <ToggleButtonGroup
            value={moyenPaiement}
            exclusive
            onChange={(_, val) => setMoyenPaiement(val)}
            sx={{ mt: 1 }}
          >
            <ToggleButton value="especes">Espèces</ToggleButton>
            <ToggleButton value="CB">Carte bancaire</ToggleButton>
          </ToggleButtonGroup>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenPaiement(false)}>Annuler</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePaiement}
            disabled={isPaying}
          >
            {isPaying ? "Paiement..." : "Payer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

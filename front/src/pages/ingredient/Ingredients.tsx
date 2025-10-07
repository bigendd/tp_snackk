import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAuth } from "../../store/useAuth";
import api from "../../api/axios";

interface Ingredient {
  id: number;
  nom: string;
  disponible: boolean;
  estSupplement: boolean;
  prixSupplement: number;
  categorieName: string;
  produitName: string;
}

export default function Ingredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/ingredients", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const raw = Array.isArray(res.data.member) ? res.data.member : res.data;

        const formatted: Ingredient[] = raw.map((ing: any) => ({
          id: ing.id ?? parseInt(ing["@id"]?.split("/").pop() || "0"),
          nom: ing.nom,
          disponible: ing.disponible,
          estSupplement: ing.estSupplement,
          prixSupplement: ing.prixSupplement ?? 0,
          categorieName: ing.categorie?.nom || "-",
          produitName: ing.produit?.nom || "-", // Récupère le nom du produit si disponible
        }));

        setIngredients(formatted);
        console.log("Ingrédients API:", formatted);
      })
      .catch((err) => console.error(err));
  }, [token]);

  const handleCreateIngredient = () => {
    if (token) navigate("/create-ingredient");
    else navigate("/login");
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nom", headerName: "Nom", flex: 1 },
    {
      field: "disponible",
      headerName: "Disponible",
      width: 120,
      renderCell: (params: any) => <span>{params.row.disponible ? "Oui" : "Non"}</span>,
    },
    {
      field: "estSupplement",
      headerName: "Supplément",
      width: 120,
      renderCell: (params: any) => <span>{params.row.estSupplement ? "Oui" : "Non"}</span>,
    },
    {
      field: "prixSupplement",
      headerName: "Prix supplément",
      width: 150,
      renderCell: (params: any) => <span>{params.row.prixSupplement.toFixed(2)} €</span>,
    },
    {
      field: "categorieName",
      headerName: "Catégorie",
      width: 150,
    },
    {
      field: "produitName",
      headerName: "Produit",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: any) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/ingredients/${params.row.id}`)}
        >
          Voir ingrédient
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">Ingrédients</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateIngredient}
          sx={{ backgroundColor: "#646cff", "&:hover": { backgroundColor: "#535bf2" } }}
        >
          Créer un ingrédient
        </Button>
      </Box>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={ingredients}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          disableRowSelectionOnClick
          getRowId={(row) => String(row.id)}
        />
      </div>
    </Box>
  );
}

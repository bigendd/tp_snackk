// src/pages/categoryingredient/CategoryIngredient.tsx
import { useEffect, useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import api from "../../api/axios";

interface CategoryIngredient {
  id: number;
  nom: string;
}

export default function CategoryIngredientPage() {
  const [categories, setCategories] = useState<CategoryIngredient[]>([]);
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<CategoryIngredient[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    api
      .get("/categorie_ingredients", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const raw = Array.isArray(res.data.member) ? res.data.member : res.data;
        const formatted: CategoryIngredient[] = raw.map((c: any) => ({
          id: c.id ?? parseInt(c["@id"]?.split("/").pop() || "0"),
          nom: c.nom
        }));
        setCategories(formatted);
        setFilteredCategories(formatted);
      })
      .catch(err => console.error(err));
  }, [token]);

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = categories.filter(c =>
      c.nom.toLowerCase().includes(term)
    );
    setFilteredCategories(filtered);
  }, [search, categories]);

  const columns: GridColDef<CategoryIngredient>[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nom", headerName: "Nom", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: GridRenderCellParams<CategoryIngredient>) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/categoryingredient/${params.row.id}`)}
        >
          Voir
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ p: 4, width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Catégories d'ingrédients</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/categoryingredient/create")}
        >
          Créer
        </Button>
      </Box>

      <TextField
        label="Rechercher par nom"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredCategories}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          disableRowSelectionOnClick
          getRowId={row => row.id}
        />
      </div>
    </Box>
  );
}

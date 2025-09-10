import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAuth } from "../store/useAuth";
import api from "../api/axios";

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        console.log("API response:", res.data);
        const raw = Array.isArray(res.data.member) ? res.data.member : [];
        const data = raw.map((cat: any, index: number) => ({
          id: cat.id ?? index,
          nom: cat.nom ?? "",
          disponible: cat.disponible ?? false,
        }));
        setCategories(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCreateCategory = () => {
    if (token) navigate("/create-category");
    else navigate("/login");
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nom", headerName: "Nom", flex: 1 },
    {
      field: "disponible",
      headerName: "Disponible",
      width: 120,
      valueFormatter: (params: any) => {
        // Sécurité si params ou params.value est undefined
        if (!params || params.value === undefined || params.value === null) {
          return "Non";
        }
        return params.value ? "Oui" : "Non";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: any) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/categories/${params.row.id}`)}
        >
          Voir produits
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4, width: "100%" }}>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}
      >
        <Typography variant="h4">Catégories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCategory}
          sx={{ backgroundColor: "#646cff", "&:hover": { backgroundColor: "#535bf2" } }}
        >
          Créer une catégorie
        </Button>
      </Box>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={categories}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          disableRowSelectionOnClick
        />
      </div>
    </Box>
  );
}

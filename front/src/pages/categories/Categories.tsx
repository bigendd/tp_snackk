import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useAuth } from "../../store/useAuth";
import api from "../../api/axios";

interface Category {
  id: number;
  nom: string;
  disponible: boolean | number | string;
  created_at: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        const raw = Array.isArray(res.data.member) ? res.data.member : res.data;

        // Normalisation pour DataGrid
        const formatted: Category[] = raw.map((cat: any) => ({
          id: cat.id ?? parseInt(cat["@id"]?.split("/").pop() || "0"),
          nom: cat.nom,
          disponible: cat.disponible,
          created_at: cat.createdAt || cat.created_at || "",
        }));

        setCategories(formatted);
        console.log("Categories API:", formatted);
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
      renderCell: (params: GridRenderCellParams<Category>) => (
        <span>{params.row.disponible ? "Oui" : "Non"}</span>
      ),
    },
    {
      field: "created_at",
      headerName: "Créé le",
      width: 150,
      renderCell: (params: GridRenderCellParams<Category>) => {
        if (!params.row.created_at) return "";
        const date = new Date(params.row.created_at);
        return <span>{isNaN(date.getTime()) ? "" : date.toLocaleDateString()}</span>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: GridRenderCellParams<Category>) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/categories/${params.row.id}`)}
        >
          Voir catégorie
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
          getRowId={(row) => String(row.id)} // <-- toujours string
        />
      </div>
    </Box>
  );
}

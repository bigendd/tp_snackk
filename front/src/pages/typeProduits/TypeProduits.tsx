import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import api from "../../api/axios";

interface TypeProduit {
  id: number;
  nom: string;
}

export default function TypeProduits() {
  const [types, setTypes] = useState<TypeProduit[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/type_produits")
      .then(res => {
        const raw = Array.isArray(res.data.member) ? res.data.member : res.data;
        const formatted: TypeProduit[] = raw.map((t: any) => ({
          id: t.id ?? parseInt(t["@id"]?.split("/").pop() || "0"),
          nom: t.nom,
        }));
        setTypes(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nom", headerName: "Nom", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: any) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/types/${params.row.id}`)}
        >
          Voir type
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4, width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4">Types de produit</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/create-type")}
        >
          Créer un type
        </Button>
      </Box>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={types}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          getRowId={(row) => String(row.id)}
        />
      </div>
    </Box>
  );
}

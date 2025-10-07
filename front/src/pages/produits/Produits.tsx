import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAuth } from "../../store/useAuth";
import api from "../../api/axios";

interface Product {
  id: number;
  nom: string;
  prix_base: number;
  disponible: boolean | number | string;
  created_at: string;
  categoryName: string;
  typeName: string;
}

export default function Produits() {
  const [products, setProducts] = useState<Product[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/produits")
      .then((res) => {
        const raw = Array.isArray(res.data.member) ? res.data.member : res.data;

        const formatted: Product[] = raw.map((prod: any) => ({
          id: prod.id ?? parseInt(prod["@id"]?.split("/").pop() || "0"),
          nom: prod.nom,
          prix_base: prod.prix_base,
          disponible: prod.disponible,
          created_at: prod.createdAt || prod.created_at || "",
          categoryName: prod.category?.nom || "-", // Catégorie ou "-" si null
          typeName: prod.type?.nom || "-",        // Type ou "-" si null
        }));

        setProducts(formatted);
        console.log("Produits API:", formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCreateProduct = () => {
    if (token) navigate("/create-product");
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
      field: "prix_base",
      headerName: "Prix",
      width: 100,
      renderCell: (params: any) => <span>{params.row.prix_base.toFixed(2)} €</span>,
    },
    {
      field: "categoryName",
      headerName: "Catégorie",
      width: 150,
    },
    {
      field: "typeName",
      headerName: "Type",
      width: 150,
    },
    {
      field: "created_at",
      headerName: "Créé le",
      width: 150,
      renderCell: (params: any) => {
        if (!params.row.created_at) return "";
        const date = new Date(params.row.created_at);
        return <span>{isNaN(date.getTime()) ? "" : date.toLocaleDateString()}</span>;
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
          onClick={() => navigate(`/produits/${params.row.id}`)}
        >
          Voir produit
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
        <Typography variant="h4">Produits</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateProduct}
          sx={{ backgroundColor: "#646cff", "&:hover": { backgroundColor: "#535bf2" } }}
        >
          Créer un produit
        </Button>
      </Box>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={products}
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

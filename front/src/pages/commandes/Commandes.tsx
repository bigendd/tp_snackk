import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useAuth } from "../../store/useAuth";
import api from "../../api/axios";

interface Commande {
  id: number;
  created_at: string;
  mode_cons: string | null;
  moyen_paiment: string;
  userName: string;
}

export default function Commandes() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/commandes")
      .then((res) => {
        // Vérifie si la réponse contient un tableau
        const raw = Array.isArray(res.data.member) ? res.data.member : res.data;

        const formatted: Commande[] = raw.map((cmd: any) => ({
          id: cmd.id ?? parseInt(cmd["@id"]?.split("/").pop() || "0"),
          created_at: cmd.createdAt || cmd.created_at || "",
          mode_cons: cmd.mode_cons || "-",
          moyen_paiment: cmd.moyen_paiment || "-",
          userName: cmd.user?.username || "-", // ou email selon ce que tu veux afficher
        }));

        setCommandes(formatted);
        console.log("Commandes API:", formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCreateCommande = () => {
    if (token) navigate("/commandes/create");
    else navigate("/login");
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
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
    { field: "mode_cons", headerName: "Mode de consommation", width: 180 },
    { field: "moyen_paiment", headerName: "Moyen de paiement", width: 180 },
    { field: "userName", headerName: "Utilisateur", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: any) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/commandes/${params.row.id}`)}
        >
          Détails
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
        <Typography variant="h4">Commandes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCommande}
          sx={{ backgroundColor: "#646cff", "&:hover": { backgroundColor: "#535bf2" } }}
        >
          Créer une commande
        </Button>
      </Box>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={commandes}
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

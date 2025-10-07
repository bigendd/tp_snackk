import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import api from "../../api/axios";
import { useAuth } from "../../store/useAuth";

interface User {
  id: number;
  email: string;
  roles: string[];
  userInfo?: {
    nom: string;
    prenom: string;
  };
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    api.get("/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const raw = Array.isArray(res.data.member) ? res.data.member : [];
        const formatted: User[] = raw.map((u: any) => ({
          id: u.id ?? parseInt(u["@id"]?.split("/").pop() || "0"),
          email: u.email,
          roles: u.roles || [],
          userInfo: u.userInfo ? { nom: u.userInfo.nom, prenom: u.userInfo.prenom } : undefined,
        }));
        setUsers(formatted);
        setFilteredUsers(formatted);
      })
      .catch(err => console.error(err));
  }, [token]);

  // Filtrage côté front
  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = users.filter(u =>
      (u.userInfo?.nom || "").toLowerCase().includes(term) ||
      (u.userInfo?.prenom || "").toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.roles.join(", ").toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "prenom", headerName: "Prénom", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "roles",
      headerName: "Roles",
      flex: 1
    },
  ];

  // Transformer userInfo.nom/prenom en nom/prenom pour DataGrid
  const rows = filteredUsers.map(u => ({
    id: u.id,
    nom: u.userInfo?.nom || "-",
    prenom: u.userInfo?.prenom || "-",
    email: u.email,
    roles: u.roles,
  }));

  return (
    <Box sx={{ p: 4, width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Utilisateurs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/create-user")}
        >
          Créer un utilisateur
        </Button>
      </Box>

      <TextField
        label="Rechercher par nom, prénom, email ou rôle"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          getRowId={(row) => String(row.id)}
        />
      </div>
    </Box>
  );
}

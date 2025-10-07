import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import LabelIcon from "@mui/icons-material/Label";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu"; // icône pour Ingrédients

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1f1f1f" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo + Home */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton component={Link} to="/" color="inherit" edge="start">
            <HomeIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: "white", textDecoration: "none" }}
          >
            MyApp
          </Typography>
        </Box>

        {/* Menu admin */}
        {token && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button color="inherit" component={Link} to="/categories" startIcon={<CategoryIcon />}>
              Catégories
            </Button>
            <Button color="inherit" component={Link} to="/produits" startIcon={<InventoryIcon />}>
              Produits
            </Button>
            <Button color="inherit" component={Link} to="/types" startIcon={<LabelIcon />}>
              Types
            </Button>
            <Button color="inherit" component={Link} to="/users" startIcon={<PeopleIcon />}>
              Utilisateurs
            </Button>
            <Button color="inherit" component={Link} to="/ingredients" startIcon={<RestaurantMenuIcon />}>
              Ingrédients
            </Button>
            <Button
  color="inherit"
  component={Link}
  to="/categoryingredient"
  startIcon={<LabelIcon />}
>
  Catégories d'ingrédients
</Button>
<Button
      color="inherit"
      component={Link}
      to="/commandes"
      startIcon={<RestaurantMenuIcon />}
    >
      Commandes
    </Button>
          </Box>
        )}

        {/* Auth buttons */}
        <Box>
          {token ? (
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" startIcon={<LoginIcon />}>
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register" startIcon={<PersonAddIcon />}>
                Register
              </Button>

            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

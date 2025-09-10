import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

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
       
        <Typography variant="h6" component={Link} to="/" sx={{ color: "white", textDecoration: "none", flexGrow: 1 }}>
         <IconButton
          component={Link}
          to="/"
          edge="start"
          color="inherit"
          
        >
          <HomeIcon />
        </IconButton>
          MyApp
        </Typography>
        <Box>
          {token ? (
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                startIcon={<PersonAddIcon />}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

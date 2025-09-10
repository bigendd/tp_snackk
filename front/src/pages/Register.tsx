// src/pages/Register.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Email, Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/register", { email, password, nom, prenom });
      navigate("/login");
    } catch (err: any) {
      setError("Erreur lors de l'inscription");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          
        }}
        elevation={6}
      >
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Inscription
        </Typography>

        {error && (
          <Typography color="error" sx={{ textAlign: "center" }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom"
            variant="outlined"
            fullWidth
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, input: { color: "#000000ff" } }}
          />

          <TextField
            label="Prénom"
            variant="outlined"
            fullWidth
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, input: { color: "#000000ff" } }}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2, input: { color: "#000000ff" } }}
          />

          <TextField
            label="Mot de passe"
            variant="outlined"
            fullWidth
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    sx={{ color: "#000000ff" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3, input: { color: "#000000ff" } }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ backgroundColor: "#646cff", "&:hover": { backgroundColor: "#535bf2" } }}
          >
            S'inscrire
          </Button>
        </form>

        <Typography sx={{ textAlign: "center", mt: 1 }}>
          Déjà un compte ?{" "}
          <Link to="/login" style={{ color: "#646cff", textDecoration: "none" }}>
            Connexion
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

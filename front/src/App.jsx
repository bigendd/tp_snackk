import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categories from "./pages/Categories";
import Produits from "./pages/Produits";
import Commande from "./pages/Commande";
import CreateCategory from "./pages/CreateCategory";

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Navbar />
<Container
  maxWidth={false} // pas de maxWidth
  sx={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: 2, // padding si besoin
  }}
>
        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categories/:id" element={<Produits />} />
          <Route path="/commande" element={<Commande />} />
            <Route path="/create-category" element={<CreateCategory />} /> {/* ← essentiel */}
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Commande from "./pages/Commande";

// Categories
import Categories from "./pages/Categories/Categories";
import CreateCategory from "./pages/categories/CreateCategory";
import CategoryDetail from "./pages/Categories/CategoryDetail";

// Produits
import Produits from "./pages/produits/Produits";
import CreateProduct from "./pages/produits/CreateProduit";
import ProductDetail from "./pages/produits/ProduitDetail";

// Types
import TypeProduits from "./pages/typeProduits/TypeProduits";
import CreateType from "./pages/typeProduits/CreateTypeProduit";
import TypeDetail from "./pages/typeProduits/TypeProduitDetail";

// Users
import UsersList from "./pages/users/UsersList";

// Ingredients
import Ingredients from "./pages/ingredient/Ingredients";
import CreateIngredient from "./pages/ingredient/CreateIngredient";
import IngredientDetail from "./pages/ingredient/IngredientDetails";

//ingredients categories
import CategoryIngredientPage from "./pages/categoryingredient/CategoryIngredient";
import CreateCategoryIngredient from "./pages/categoryingredient/CreateCategoryIngredient";
import CategoryIngredientDetail from "./pages/categoryingredient/CategoryIngredientDetails";

import Commandes from "./pages/commandes/Commandes";
import CreateCommande from "./pages/commandes/CreateCommande";
import CommandeDetails from "./pages/commandes/CommandeDetails";


export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Navbar />
      <Container
        maxWidth={false}
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: 2,
        }}
      >
        <Routes>
          {/* Categories */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/create-category" element={<CreateCategory />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />

          {/* Produits */}
          <Route path="/produits" element={<Produits />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/produits/:id" element={<ProductDetail />} />

          {/* Types */}
          <Route path="/types" element={<TypeProduits />} />
          <Route path="/create-type" element={<CreateType />} />
          <Route path="/types/:id" element={<TypeDetail />} />

          {/* Users */}
          <Route path="/users" element={<UsersList />} />

          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/create-ingredient" element={<CreateIngredient />} />
          <Route path="/ingredients/:id" element={<IngredientDetail />} />

          {/* CategoryIngredient */}
          <Route path="/categoryingredient" element={<CategoryIngredientPage />} />
          <Route path="/categoryingredient/create" element={<CreateCategoryIngredient />} />
          <Route path="/categoryingredient/:id" element={<CategoryIngredientDetail />} />

          <Route path="/commandes" element={<Commandes />} />
          <Route path="/commandes/create" element={<CreateCommande />} />
          <Route path="/commandes/:id" element={<CommandeDetails />} />

          {/* Auth & commande */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/commande" element={<Commande />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

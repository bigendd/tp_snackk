import {
  Home,
  Utensils,
  ShoppingBag,
  Bell,
  ChefHat,
  Users,
  Building,
  HardDrive,
  Grid,
} from "lucide-react";

export const MenuItems = [
  {
    id: 1,
    name: "Tableau de bord",
    icon: Home,
    path: "/dashboard",
    badge: "New",
  },
  {
    id: 2,
    name: "Commandes",
    icon: Bell,
    path: "/orders",
  },
  {
    id: 3,
    name: "Produits",
    icon: ShoppingBag,
    path: "/products",
    children: [
      { name: "Liste", path: "/products" },
      { name: "Nouveau", path: "/products/new" },
    ],
  },
  {
    id: 4,
    name: "Catégories",
    icon: Grid,
    path: "/categories",
    children: [
      { name: "Produits", path: "/categories" },
      { name: "Types", path: "/type-products" },
    ],
  },
  {
    id: 5,
    name: "Stock & Inventaire",
    icon: HardDrive,
    path: "/stock",
  },
  {
    id: 6,
    name: "Ingrédients",
    icon: ChefHat,
    path: "/ingredients",
    children: [
      { name: "Liste", path: "/ingredients" },
      { name: "Catégories", path: "/ingredient-categories" },
    ],
  },
  {
    id: 7,
    name: "Restaurants & Bornes",
    icon: Building,
    path: "/restaurants",
    children: [
      { name: "Restaurants", path: "/restaurants" },
      { name: "Bornes", path: "/kiosks" },
    ],
  },
  {
    id: 8,
    name: "Utilisateurs",
    icon: Users,
    path: "/users",
  },
];

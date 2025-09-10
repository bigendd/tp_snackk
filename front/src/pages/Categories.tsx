// src/pages/Categories.tsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.get("/categories.json").then((res) => {
      setCategories(res.data["hydra:member"]);
    });
  }, []);

  return (
    <div>
      <h1>Catégories</h1>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link to={`/categories/${cat.id}`}>{cat.nom}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

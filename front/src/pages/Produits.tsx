// src/pages/Produits.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function Produits() {
  const { id } = useParams(); // id de la catégorie
  const [produits, setProduits] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      api.get(`/produits.json`).then((res) => {
        // filtrer les produits par catégorie
        const filtered = res.data["hydra:member"].filter(
          (p: any) => p.categorie && p.categorie.id === parseInt(id)
        );
        setProduits(filtered);
      });
    }
  }, [id]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Produits de la catégorie {id}</h1>
      <ul>
        {produits.map((p) => (
          <li key={p.id}>
            {p.nom} - {p.prix} €
          </li>
        ))}
      </ul>
    </div>
  );
}

// src/pages/Commande.tsx
import { useState } from "react";
import api from "../api/axios";

export default function Commande() {
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await api.post("/commandes.json", {
        // ici tu enverras les infos du panier
        client: 1, 
        produits: [],
      });
      setMessage("Commande passée !");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la commande");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Passer une commande</h1>
      <button onClick={handleSubmit}>Commander</button>
      {message && <p>{message}</p>}
    </div>
  );
}

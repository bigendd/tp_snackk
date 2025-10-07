import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import axios from "axios";

interface CommandeProduit {
  produit: { nom: string; prix_base: number };
  quantite: number;
}

interface Commande {
  id: number;
  createdAt: string;
  mode_cons: string;
  moyen_paiment: string;
  user: { username: string };
  commandeProduits: CommandeProduit[];
}

const CommandeDetails = () => {
  const { id } = useParams();
  const [commande, setCommande] = useState<Commande | null>(null);

  useEffect(() => {
    axios.get(`/api/commandes/${id}`).then(res => setCommande(res.data));
  }, [id]);

  if (!commande) return <Typography>Chargement...</Typography>;

  const total = commande.commandeProduits?.reduce((acc, cp) => acc + cp.quantite * cp.produit.prix_base, 0) || 0;

  return (
    <div>
      <Typography variant="h4">Commande #{commande.id}</Typography>
      <Typography>Client: {commande.user?.username}</Typography>
      <Typography>Date: {new Date(commande.createdAt).toLocaleString()}</Typography>
      <Typography>Mode: {commande.mode_cons}</Typography>
      <Typography>Moyen de paiement: {commande.moyen_paiment}</Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Produit</TableCell>
            <TableCell>Quantité</TableCell>
            <TableCell>Prix</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commande.commandeProduits.map((cp, index) => (
            <TableRow key={index}>
              <TableCell>{cp.produit.nom}</TableCell>
              <TableCell>{cp.quantite}</TableCell>
              <TableCell>{cp.quantite * cp.produit.prix_base} €</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography variant="h6">Total: {total} €</Typography>
    </div>
  );
};

export default CommandeDetails;

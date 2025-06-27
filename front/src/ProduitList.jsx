// ProduitList.jsx
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  EditButton,
  ShowButton,
  DeleteButton,
  SearchInput,
  BooleanInput,
  TextInput
} from 'react-admin';

// Filtres pour la recherche
const produitFilters = [
  <SearchInput source="nom" placeholder="Rechercher par nom" alwaysOn />,
  <BooleanInput source="disponible" label="Disponible" />,
];

export const ProduitList = () => (
  <List
    filters={produitFilters}
    sort={{ field: 'nom', order: 'ASC' }}
    perPage={25}
    title="Liste des produits"
  >
    <Datagrid>
      <TextField source="id" label="ID" />
      <TextField source="nom" label="Nom" />
      <TextField source="description" label="Description" />
      <NumberField 
        source="prix_base" 
        label="Prix de base" 
        options={{ 
          style: 'currency', 
          currency: 'EUR',
          minimumFractionDigits: 2 
        }} 
      />
      <BooleanField source="disponible" label="Disponible" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default ProduitList;
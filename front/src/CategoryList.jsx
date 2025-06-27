// ProduitList.jsx
import React from 'react';
import { List, Datagrid, TextField, NumberField, BooleanField } from 'react-admin';

export const CategoryList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="nom" />
      <BooleanField source="disponible" />
    </Datagrid>
  </List>
);

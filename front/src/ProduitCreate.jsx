// ProduitCreate.jsx avec relation Category
import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  required,
  minValue,
  maxLength
} from 'react-admin';

export const ProduitCreate = () => (
  <Create title="Créer un nouveau produit">
    <SimpleForm>
      <TextInput 
        source="nom" 
        label="Nom du produit"
        validate={[required('Le nom est obligatoire'), maxLength(150, 'Le nom ne doit pas dépasser 150 caractères')]}
        fullWidth
      />
      
      <TextInput 
        source="description" 
        label="Description"
        multiline
        rows={4}
        fullWidth
        validate={[required('La description est obligatoire')]}
      />
      
      <NumberInput 
        source="prix_base" 
        label="Prix de base (€)"
        validate={[required('Le prix est obligatoire'), minValue(0, 'Le prix doit être positif')]}
        step={0.01}
      />
      
      <ReferenceInput
  source="category"
  reference="categories"
  label="Catégorie"
>
  <SelectInput
    optionText="nom"
    optionValue="id"
    validate={[required('La catégorie est obligatoire')]}
  />
</ReferenceInput>
      
      <BooleanInput 
        source="disponible" 
        label="Produit disponible"
        defaultValue={true}
        helperText="Le produit est-il disponible à la vente ?"
      />
    </SimpleForm>
  </Create>
);

export default ProduitCreate;
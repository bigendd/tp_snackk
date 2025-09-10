<?php

namespace App\Service;

class PasswordValidator
{
    public function validate(string $password): ?string
    {

        if (!$password) {
            return 'Le mot de passe ne peut pas être vide';
        }
        if (strlen($password) < 8) {
            return 'Le mot de passe doit contenir au moins 8 caractères';
        }
        if (!preg_match('/[A-Z]/', $password)) {
            return 'Le mot de passe doit contenir au moins une majuscule';
        }
        if (!preg_match('/[a-z]/', $password)) {
            return 'Le mot de passe doit contenir au moins une minuscule';
        }
        if (!preg_match('/\d/', $password)) {
            return 'Le mot de passe doit contenir au moins un chiffre';
        }
        if (!preg_match('/[\W_]/', $password)) {
            return 'Le mot de passe doit contenir au moins un caractère spécial';
        }

        return null; // mot de passe valide
    }
}

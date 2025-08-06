<?php

namespace App\Enum;

enum StatutCommande: string
{
    case EN_ATTENTE = 'en_attente';
    case EN_COURS = 'en_cours';
    case PRET = 'prêt';
    case TERMINE = 'terminé';
    case ANNULEE = 'annulee';
}

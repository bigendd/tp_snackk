<?php
namespace App\Enum;

enum MoyenDePaiment: string
{
    case ESPECE = 'especes';
    case CARTE_BANCAIRE = 'CB';
}

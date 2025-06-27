<?php
namespace App\Enum;

enum MoyenDePaiment: string
{
    case SUR_PLACE = 'espèce';
    case EMPORTER = 'carte_bancaire';
}

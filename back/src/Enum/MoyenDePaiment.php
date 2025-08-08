<?php
namespace App\Enum;

enum MoyenDePaiment: string
{
    case ESPECE = 'espece';
    case CARTE_BANCAIRE = 'CB';
}

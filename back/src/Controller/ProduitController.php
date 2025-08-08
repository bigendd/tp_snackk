<?php

namespace App\Controller;

use App\Repository\ProduitRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ProduitController
{
    #[Route('/api/produits/avec-ingredients', name: 'produits_avec_ingredients', methods: ['GET'])]
    public function produitsAvecIngredients(ProduitRepository $produitRepository): JsonResponse
    {
        $produits = $produitRepository->findAllWithIngredients();

        return new JsonResponse($produits, JsonResponse::HTTP_OK);
    }

    #[Route('/api/produits/disponibles', name: 'produits_disponibles', methods: ['GET'])]
    public function produitsDisponibles(ProduitRepository $produitRepository): JsonResponse
    {
        $produits = $produitRepository->findAvailableProducts();

        return new JsonResponse($produits, JsonResponse::HTTP_OK);
    }

    #[Route('/api/produits/indisponibles', name: 'produits_indisponibles', methods: ['GET'])]
    public function produitsIndisponibles(ProduitRepository $produitRepository): JsonResponse
    {
        $produits = $produitRepository->findUnavailableProducts();

        return new JsonResponse($produits, JsonResponse::HTTP_OK);
    }
}

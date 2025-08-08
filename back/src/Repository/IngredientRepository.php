<?php

namespace App\Repository;

use App\Entity\Ingredient;
use App\Entity\Produit;
use App\Entity\CategorieIngredient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Ingredient>
 */
class IngredientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Ingredient::class);
    }


    /**
     * Trouve un ingrédient par son nom exact.
     */
    public function findOneByNom(string $nom): ?Ingredient
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.nom = :nom')
            ->setParameter('nom', $nom)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Récupère tous les ingrédients disponibles.
     *
     * @return Ingredient[]
     */
    public function findAvailable(): array
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.disponible = :val')
            ->setParameter('val', true)
            ->orderBy('i.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère tous les ingrédients associés à un produit donné.
     *
     * @param Produit|int $produit
     * @return Ingredient[]
     */
    public function findByProduit($produit): array
    {
        $produitId = $produit instanceof Produit ? $produit->getId() : $produit;

        return $this->createQueryBuilder('i')
            ->andWhere('i.produit = :prod')
            ->setParameter('prod', $produitId)
            ->orderBy('i.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère les ingrédients selon leur catégorie.
     *
     * @param CategorieIngredient|int $categorie
     * @return Ingredient[]
     */
    public function findByCategorie($categorie): array
    {
        $categorieId = $categorie instanceof CategorieIngredient ? $categorie->getId() : $categorie;

        return $this->createQueryBuilder('i')
            ->andWhere('i.categorie = :cat')
            ->setParameter('cat', $categorieId)
            ->orderBy('i.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Recherche des ingrédients par mot-clé sur le nom.
     *
     * @return Ingredient[]
     */
    public function searchByKeyword(string $keyword): array
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.nom LIKE :kw')
            ->setParameter('kw', '%' . $keyword . '%')
            ->orderBy('i.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère tous les ingrédients qui sont des suppléments.
     *
     * @return Ingredient[]
     */
    public function findSupplements(): array
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.estSupplement = :val')
            ->setParameter('val', true)
            ->orderBy('i.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }
}

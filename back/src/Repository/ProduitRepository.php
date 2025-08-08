<?php

namespace App\Repository;

use App\Entity\TypeProduit;
use App\Entity\Produit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Produit>
 */
class ProduitRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Produit::class);
    }

    //    /**
    //     * @return Produit[] Returns an array of Produit objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Produit
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    /**
     * Récupère tous les produits avec leurs ingrédients et quantités.
     */
    public function findAllWithIngredients(): array
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.ingredients', 'i')
            ->addSelect('i')
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère tous les produits disponibles (disponible = true).
     */
    public function findAvailableProducts(): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.disponible = :val')
            ->setParameter('val', true)
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère tous les produits indisponibles (disponible = false).
     */
    public function findUnavailableProducts(): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.disponible = :val')
            ->setParameter('val', false)
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère les produits par type (boisson, plat, dessert...)
     *
     * @param TypeProduit|int $type
     * @return Produit[]
     */
    public function findByType($type): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.type = :type')
            ->setParameter('type', $type instanceof TypeProduit ? $type->getId() : $type)
            ->orderBy('p.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Recherche un produit par son nom exact
     */
    public function findOneByNom(string $nom): ?Produit
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.nom = :nom')
            ->setParameter('nom', $nom)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Recherche un produit par mot-clé (nom partiel)
     *
     * @return Produit[]
     */
    public function searchByKeyword(string $keyword): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.nom LIKE :kw')
            ->setParameter('kw', '%' . $keyword . '%')
            ->orderBy('p.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }
}

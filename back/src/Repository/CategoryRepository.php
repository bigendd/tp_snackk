<?php

namespace App\Repository;

use App\Entity\Category;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Category>
 */
class CategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Category::class);
    }

    //    /**
    //     * @return Category[] Returns an array of Category objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Category
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    /**
     * Récupère toutes les catégories disponibles.
     *
     * @return Category[]
     */
    public function findAvailable(): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.disponible = :val')
            ->setParameter('val', true)
            ->orderBy('c.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère les catégories par nom exact.
     */
    public function findOneByNom(string $nom): ?Category
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.nom = :nom')
            ->setParameter('nom', $nom)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Recherche les catégories par mot-clé sur le nom.
     *
     * @return Category[]
     */
    public function searchByKeyword(string $keyword): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.nom LIKE :kw')
            ->setParameter('kw', '%' . $keyword . '%')
            ->orderBy('c.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère les catégories avec leurs produits associés.
     *
     * @return Category[]
     */
    public function findAllWithProducts(): array
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.produit', 'p')
            ->addSelect('p')
            ->orderBy('c.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }
}

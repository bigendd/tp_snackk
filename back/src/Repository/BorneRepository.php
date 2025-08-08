<?php

namespace App\Repository;

use App\Entity\Borne;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Borne>
 */
class BorneRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Borne::class);
    }

//    /**
//     * @return Borne[] Returns an array of Borne objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('b')
//            ->andWhere('b.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('b.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Borne
//    {
//        return $this->createQueryBuilder('b')
//            ->andWhere('b.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }

/**
     * Trouve une borne par son nom exact.
     */
    public function findOneByNom(string $nom): ?Borne
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.nom = :nom')
            ->setParameter('nom', $nom)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Récupère toutes les bornes d'un restaurant donné.
     *
     * @param Restaurant|int $restaurant
     * @return Borne[]
     */
    public function findByRestaurant($restaurant): array
    {
        $restaurantId = $restaurant instanceof Restaurant ? $restaurant->getId() : $restaurant;

        return $this->createQueryBuilder('b')
            ->andWhere('b.restaurant = :resto')
            ->setParameter('resto', $restaurantId)
            ->orderBy('b.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Recherche des bornes par mot-clé sur le nom.
     *
     * @return Borne[]
     */
    public function searchByKeyword(string $keyword): array
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.nom LIKE :kw')
            ->setParameter('kw', '%' . $keyword . '%')
            ->orderBy('b.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }
}

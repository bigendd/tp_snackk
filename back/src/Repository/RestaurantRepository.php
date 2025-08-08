<?php

namespace App\Repository;

use App\Entity\Restaurant;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Restaurant>
 */
class RestaurantRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Restaurant::class);
    }

    /**
     * Trouve un restaurant par son nom exact.
     */
    public function findOneByNom(string $nom): ?Restaurant
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.nom = :nom')
            ->setParameter('nom', $nom)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Trouve un restaurant par son adresse exacte.
     */
    public function findOneByAdresse(string $adresse): ?Restaurant
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.adresse = :adresse')
            ->setParameter('adresse', $adresse)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Recherche des restaurants par mot-clé dans le nom ou l'adresse.
     *
     * @return Restaurant[]
     */
    public function searchByKeyword(string $keyword): array
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.nom LIKE :kw OR r.adresse LIKE :kw')
            ->setParameter('kw', '%' . $keyword . '%')
            ->orderBy('r.nom', 'ASC')
            ->getQuery()
            ->getResult();
    }
}

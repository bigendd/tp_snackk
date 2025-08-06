<?php

namespace App\Repository;

use App\Entity\Commande;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Commande>
 */
class CommandeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Commande::class);
    }

    //    /**
    //     * @return Commande[] Returns an array of Commande objects
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

    //    public function findOneBySomeField($value): ?Commande
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    
    /**
     * Récupère toutes les commandes avec leurs produits (et infos produit) en une requête
     */
    public function findAllWithProduits(): array
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.commandeProduits', 'cp')
            ->leftJoin('cp.produit', 'p')
            ->addSelect('cp', 'p')
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère une commande spécifique avec ses produits
     */
    public function findOneWithProduits(int $id): ?Commande
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.commandeProduits', 'cp')
            ->leftJoin('cp.produit', 'p')
            ->addSelect('cp', 'p')
            ->andWhere('c.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }
}

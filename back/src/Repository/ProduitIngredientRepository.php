<?php

namespace App\Repository;

use App\Entity\ProduitIngredient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ProduitIngredient>
 *
 * @method ProduitIngredient|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProduitIngredient|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProduitIngredient[]    findAll()
 * @method ProduitIngredient[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProduitIngredientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProduitIngredient::class);
    }

    public function save(ProduitIngredient $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ProduitIngredient $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // Exemples de méthodes personnalisées :
    /*
    public function findByProduit($produitId): array
    {
        return $this->createQueryBuilder('pi')
            ->andWhere('pi.produit = :val')
            ->setParameter('val', $produitId)
            ->orderBy('pi.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }
    */
}

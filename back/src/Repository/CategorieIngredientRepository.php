<?php

namespace App\Repository;

use App\Entity\CategorieIngredient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CategorieIngredient>
 *
 * @method CategorieIngredient|null find($id, $lockMode = null, $lockVersion = null)
 * @method CategorieIngredient|null findOneBy(array $criteria, array $orderBy = null)
 * @method CategorieIngredient[]    findAll()
 * @method CategorieIngredient[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategorieIngredientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CategorieIngredient::class);
    }

    public function save(CategorieIngredient $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(CategorieIngredient $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);
        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    // Exemple méthode personnalisée : trouver par nom
    /*
    public function findByNom(string $nom): ?CategorieIngredient
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.nom = :nom')
            ->setParameter('nom', $nom)
            ->getQuery()
            ->getOneOrNullResult();
    }
    */
}

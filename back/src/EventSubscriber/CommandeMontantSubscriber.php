<?php
namespace App\EventSubscriber;

use App\Entity\Commande;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;

class CommandeMontantSubscriber implements EventSubscriber
{
    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
            Events::preUpdate,
        ];
    }

    public function prePersist(LifecycleEventArgs $args): void
    {
        $this->calculerMontantTotal($args);
    }

    public function preUpdate(LifecycleEventArgs $args): void
    {
        $this->calculerMontantTotal($args);

        // Important pour que Doctrine reconnaisse la modification de montantTotal
        $entity = $args->getEntity();
        $em = $args->getEntityManager();
        $uow = $em->getUnitOfWork();

        $meta = $em->getClassMetadata(get_class($entity));
        $uow->recomputeSingleEntityChangeSet($meta, $entity);
    }

    private function calculerMontantTotal(LifecycleEventArgs $args): void
    {
        $entity = $args->getEntity();

        if (!$entity instanceof Commande) {
            return;
        }

        $total = 0.0;
        foreach ($entity->getCommandeProduits() as $cp) {
            $prixProduit = $cp->getProduit()->getPrixBase() ?? 0;
            $quantite = $cp->getQuantite() ?? 0;
            $total += $prixProduit * $quantite;
        }

        $entity->setMontantTotal($total);
    }
}

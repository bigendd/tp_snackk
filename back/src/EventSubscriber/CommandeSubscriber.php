<?php
// src/EventSubscriber/CommandeSubscriber.php
namespace App\EventSubscriber;

use App\Entity\Commande;
use App\Entity\CommandeInfo;
use App\Repository\BorneRepository;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;

class CommandeSubscriber implements EventSubscriber
{
    public function __construct(private BorneRepository $borneRepository) {}

    public function getSubscribedEvents(): array
    {
        return [Events::prePersist];
    }

    public function prePersist(LifecycleEventArgs $args): void
    {
        $commande = $args->getObject();

        if (!$commande instanceof Commande) {
            return;
        }

        // Si aucune CommandeInfo existante
        if ($commande->getCommandeInfo() === null) {
            $borne = $this->borneRepository->find(1); // borne existante
            $commandeInfo = new CommandeInfo();
            $commandeInfo->setBorne($borne);
            $commandeInfo->setCommande($commande);
            $commande->setCommandeInfo($commandeInfo);
        }
    }
}

<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Enum\StatutCommande;
use App\Repository\CommandeInfoRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CommandeInfoRepository::class)]

#[ApiResource(
    normalizationContext: ['groups' => ['commande_info:read']],
    denormalizationContext: ['groups' => ['commande_info:write']]
)]

class CommandeInfo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['commande_info:read'])]
    private ?int $id = null;
    
    #[ORM\OneToOne(inversedBy: 'commandeInfo', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['commande_info:read', 'commande_info:write'])]
    private ?Commande $commande = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['commande_info:read', 'commande_info:write'])]
    private ?Restaurant $restaurant = null;

    #[ORM\ManyToOne]
    #[Groups(['commande_info:read', 'commande_info:write'])]
    private ?Borne $borne = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCommande(): ?Commande { return $this->commande; }
    public function setCommande(?Commande $commande): static
    {
        $this->commande = $commande;
        return $this;
    }

    public function getRestaurant(): ?Restaurant { return $this->restaurant; }
    public function setRestaurant(?Restaurant $restaurant): static
    {
        $this->restaurant = $restaurant;
        return $this;
    }

    public function getBorne(): ?Borne { return $this->borne; }
    public function setBorne(?Borne $borne): static
    {
        $this->borne = $borne;
        return $this;
    }

}

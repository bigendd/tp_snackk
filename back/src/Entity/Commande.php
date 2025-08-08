<?php

namespace App\Entity;

use App\Enum\ModeConsommation;
use App\Enum\MoyenDePaiment;
use App\Repository\CommandeRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post; 
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\GetCollection;


#[ORM\Entity(repositoryClass: CommandeRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(normalizationContext: ['groups' => ['commande:read']]), 
        new Post(denormalizationContext: ['groups' => ['commande:write']]),
        new Put(denormalizationContext: ['groups' => ['commande:write']])
    ],
    normalizationContext: ['groups' => ['commande:read']]
)]
class Commande
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['commande:read', 'commande_produit:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Assert\NotNull(message: "La date de création est obligatoire.")]
    #[Groups(['commande:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true, enumType: ModeConsommation::class)]
    #[Groups(['commande:read', 'commande:write'])]
    private ?ModeConsommation $mode_cons = null;

    #[ORM\Column(enumType: MoyenDePaiment::class)]
    #[Assert\NotNull(message: "Le moyen de paiement est obligatoire")]
    #[Groups(['commande:read', 'commande:write'])]
    private ?MoyenDePaiment $moyen_paiment = null;

    #[ORM\ManyToOne(inversedBy: 'commandes')]
    #[Groups(['commande:read', 'commande:write'])]
    private ?User $user = null;

    #[ORM\OneToMany(mappedBy: 'commande', targetEntity: CommandeProduit::class, cascade: ['persist', 'remove'])]
    #[Groups(['commande:read', 'commande:write'])]
    private Collection $commandeProduits;

    #[ORM\OneToOne(mappedBy: 'commande', targetEntity: CommandeInfo::class, cascade: ['persist', 'remove'])]
    #[Groups(['commande:read', 'commande:write'])]
    private ?CommandeInfo $commandeInfo = null;

    public function __construct()
    {
        $this->commandeProduits = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getModeCons(): ?ModeConsommation
    {
        return $this->mode_cons;
    }

    public function setModeCons(?ModeConsommation $mode_cons): static
    {
        $this->mode_cons = $mode_cons;
        return $this;
    }

    public function getMoyenPaiment(): ?MoyenDePaiment
    {
        return $this->moyen_paiment;
    }

    public function setMoyenPaiment(?MoyenDePaiment $moyen_paiment): static
    {
        $this->moyen_paiment = $moyen_paiment;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

    /**
     * @return Collection<int, CommandeProduit>
     */
    public function getCommandeProduits(): Collection
    {
        return $this->commandeProduits;
    }

    public function addCommandeProduit(CommandeProduit $commandeProduit): static
    {
        if (!$this->commandeProduits->contains($commandeProduit)) {
            $this->commandeProduits[] = $commandeProduit;
            $commandeProduit->setCommande($this);
        }
        return $this;
    }

    public function removeCommandeProduit(CommandeProduit $commandeProduit): static
    {
        if ($this->commandeProduits->removeElement($commandeProduit)) {
            if ($commandeProduit->getCommande() === $this) {
                $commandeProduit->setCommande(null);
            }
        }
        return $this;
    }

    public function getCommandeInfo(): ?CommandeInfo
    {
        return $this->commandeInfo;
    }

    public function setCommandeInfo(?CommandeInfo $commandeInfo): static
    {
        if ($commandeInfo->getCommande() !== $this) {
            $commandeInfo->setCommande($this);
        }
        $this->commandeInfo = $commandeInfo;
        return $this;
    }
}

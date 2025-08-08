<?php

namespace App\Entity;

use App\Enum\ModeConsommation;
use App\Enum\MoyenDePaiment;
use App\Repository\CommandeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;


#[ORM\Entity(repositoryClass: CommandeRepository::class)]
#[ApiResource(
    operations: [
        new Put(),
        new Get(),
        new Post(),
        new Delete(),
        new GetCollection(),  
    ]
)]
class Commande
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private \DateTime $date;

    #[ORM\Column(enumType: ModeConsommation::class)]
    private ?ModeConsommation $mode_cons = null;

    #[ORM\Column(enumType: MoyenDePaiment::class)]
    private ?MoyenDePaiment $moyen_paiment = null;

    #[ORM\ManyToOne]
    private ?User $user = null;

    #[ORM\OneToMany(mappedBy: 'commande', targetEntity: CommandeProduit::class, cascade: ['persist', 'remove'])]
    private Collection $commandeProduits;

    #[ORM\OneToOne(mappedBy: 'commande', cascade: ['persist', 'remove'])]
    private ?CommandeInfo $commandeInfo = null;

    public function __construct()
    {
        $this->commandeProduits = new ArrayCollection();
        $this->date = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): \DateTime
    {
        return $this->date;
    }

    public function setDate(\DateTime $date): static
    {
        $this->date = $date;
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
        $this->commandeInfo = $commandeInfo;
        return $this;
    }
}

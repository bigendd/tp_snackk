<?php

namespace App\Entity;

use App\Enum\ModeConsommation;
use App\Enum\MoyenDePaiment;
use App\Repository\CommandeRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Produit;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: CommandeRepository::class)]
#[ApiResource]
class Commande
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['commande:read'])]
    private ?int $id = null;

    #[ORM\Column]
    private ?\DateTime $date = null;

    #[ORM\Column(nullable: true, enumType: ModeConsommation::class)]
    private ?ModeConsommation $mode_cons = null;

    #[ORM\Column(enumType: MoyenDePaiment::class)]
    #[Assert\NotNull(message: "Le moyen de paiement est obligatoire")]
    #[Groups(['commande:read', 'commande:write'])]
    private ?MoyenDePaiment $moyen_paiment = null;

    #[ORM\ManyToOne(inversedBy: 'commande')]
    private ?Category $category = null;

    #[ORM\ManyToOne(inversedBy: 'commande')]
    private ?User $user = null;

    #[ORM\ManyToMany(targetEntity: Produit::class)]
    private Collection $produits;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTime
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
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

    public function addProduit(Produit $produit): self
    {
        if (!$this->produits->contains($produit)) {
            $this->produits[] = $produit;
        }

        return $this;
    }

    public function removeProduit(Produit $produit): self
    {
        $this->produits->removeElement($produit);

        return $this;
    }
}
<?php

namespace App\Entity;

<<<<<<< HEAD
use App\Repository\CommandeProduitRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CommandeProduitRepository::class)]
=======
use ApiPlatform\Metadata\ApiResource;
use App\Repository\CommandeProduitRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CommandeProduitRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['commande_produit:read']],
    denormalizationContext: ['groups' => ['commande_produit:write']]
)]
>>>>>>> feature/ValidationDesChamps
class CommandeProduit
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
<<<<<<< HEAD
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'commandeProduits')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Commande $commande = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Produit $produit = null;

    #[ORM\Column]
    private int $quantite;

    #[ORM\Column]
    private float $prixUnitaire;
=======
    #[Groups(['commande_produit:read', 'commande:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['commande_produit:read', 'commande_produit:write', 'commande:write', 'commande:read'])]
    private ?Produit $produit = null;

    #[ORM\ManyToOne(inversedBy: 'commandeProduits')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['commande_produit:read', 'commande_produit:write', 'commande:write'])]
    private ?Commande $commande = null;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Assert\Positive(message: "La quantité doit être supérieure à 0")]
    #[Groups(['commande_produit:read', 'commande_produit:write', 'commande:read', 'commande:read'])]
    private int $quantite = 1;

    #[ORM\Column(type: 'float', nullable: true)]
    #[Assert\Positive(message: "Le prix unitaire doit être un nombre positif.")]
    #[Groups(['commande_produit:read', 'commande_produit:write', 'commande:read'])]
    private ?float $prixUnitaire = null;

    #[ORM\ManyToMany(targetEntity: Ingredient::class)]
    #[Groups(['commande_produit:read', 'commande_produit:write'])]
    private Collection $ingredientsChoisis;

    public function __construct()
    {
        $this->ingredientsChoisis = new ArrayCollection();
    }
>>>>>>> feature/ValidationDesChamps

    public function getId(): ?int
    {
        return $this->id;
    }

<<<<<<< HEAD
    public function getCommande(): ?Commande
    {
        return $this->commande;
    }

    public function setCommande(?Commande $commande): static
    {
        $this->commande = $commande;
        return $this;
    }

    public function getProduit(): ?Produit
    {
        return $this->produit;
    }

    public function setProduit(?Produit $produit): static
    {
        $this->produit = $produit;
        return $this;
    }

    public function getQuantite(): int
    {
        return $this->quantite;
    }

    public function setQuantite(int $quantite): static
    {
        $this->quantite = $quantite;
        return $this;
    }

    public function getPrixUnitaire(): float
    {
        return $this->prixUnitaire;
    }

    public function setPrixUnitaire(float $prixUnitaire): static
    {
=======
    public function getProduit(): ?Produit { return $this->produit; }
    public function setProduit(?Produit $produit): static { $this->produit = $produit; return $this; }


    public function getCommande(): ?Commande { return $this->commande; }
    public function setCommande(?Commande $commande): static { $this->commande = $commande; return $this; }

    public function getQuantite(): ?int { return $this->quantite; }
    public function setQuantite(int $quantite): static { $this->quantite = $quantite; return $this; }

    public function getPrixUnitaire(): ?float
    {
    return $this->prixUnitaire;
    }

    public function setPrixUnitaire(float $prixUnitaire): static {
>>>>>>> feature/ValidationDesChamps
        $this->prixUnitaire = $prixUnitaire;
        return $this;
    }

<<<<<<< HEAD
    public function getTotalLigne(): float
    {
        return $this->prixUnitaire * $this->quantite;
    }
=======
    #[ORM\PrePersist]
    public function setPrixUnitaireOnPersist(): void
    {
        // On ne remplit le prix que s'il n'est pas déjà défini
        if ($this->prixUnitaire === null) {
            $this->prixUnitaire = $this->getProduit()->getPrixBase();
        }
    }

    /**
     * @return Collection<int, Ingredient>
     */
    public function getIngredientsChoisis(): Collection
    {
        return $this->ingredientsChoisis;
    }

    public function addIngredientsChoisi(Ingredient $ingredient): static
    {
        if (!$this->ingredientsChoisis->contains($ingredient)) {
            $this->ingredientsChoisis[] = $ingredient;
        }
        return $this;
    }

    public function removeIngredientsChoisi(Ingredient $ingredient): static
    {
        $this->ingredientsChoisis->removeElement($ingredient);
        return $this;
    }

    #[ORM\PrePersist]
    public function setPrixIfNotSet(): void
    {
        if ($this->prixUnitaire === null && $this->produit !== null) {
            $this->prixUnitaire = $this->produit->getPrixBase();
        }
    }
   
>>>>>>> feature/ValidationDesChamps
}

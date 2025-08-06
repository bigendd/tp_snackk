<?php

namespace App\Entity;

use App\Repository\ProduitRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

#[ORM\Entity(repositoryClass: ProduitRepository::class)]
#[UniqueEntity(fields: ['nom'], message: "Ce nom de produit existe déjà.")]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['produit:read']]),
        new GetCollection(normalizationContext: ['groups' => ['produit:read']]),
        new Post(denormalizationContext: ['groups' => ['produit:write']]),
        new Put(denormalizationContext: ['groups' => ['produit:write']]),
        new Delete()
    ]
)]
class Produit
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['produit:read', 'category:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 150, unique: true)]
    #[Assert\NotBlank(message: "Le nom du produit est obligatoire.")]
    #[Assert\Length(
        min: 2,
        minMessage: "Le nom doit contenir au moins {{ limit }} caractères.",
        max: 150,
        maxMessage: "Le nom ne peut pas dépasser {{ limit }} caractères."
    )]
    #[Groups(['produit:read', 'produit:write', 'category:read','commande:read'])]
    private ?string $nom = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['produit:read', 'produit:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Assert\NotNull(message: "Le prix de base est obligatoire.")]
    #[Assert\Positive(message: "Le prix doit être un nombre positif.")]
    #[Groups(['produit:read', 'produit:write', 'commande:read'])]
    private ?float $prix_base = null;

    #[ORM\Column]
    #[Assert\NotNull(message: "Le champ 'disponible' est obligatoire.")]
    #[Groups(['produit:read', 'produit:write'])]
    private ?bool $disponible = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Assert\NotNull(message: "La date de création est obligatoire.")]
    private ?\DateTimeImmutable $createdAt = null;


    #[ORM\ManyToOne(inversedBy: 'produit')]
    #[Assert\NotNull(message: "La catégorie est obligatoire.")]
    #[Groups(['produit:read', 'produit:write'])]
    private ?Category $category = null;

    /**
     * @var Collection<int, Sauce>
     */
    #[ORM\OneToMany(targetEntity: Sauce::class, mappedBy: 'produit')]
    #[Groups(['produit:read'])]
    private Collection $sauce;

    /**
     * @var Collection<int, Viande>
     */
    #[ORM\OneToMany(targetEntity: Viande::class, mappedBy: 'produit')]
    #[Groups(['produit:read'])]
    private Collection $viande;

    /**
     * @var Collection<int, Supplement>
     */
    #[ORM\OneToMany(targetEntity: Supplement::class, mappedBy: 'produit')]
    #[Groups(['produit:read'])]
    private Collection $supplement;

    /**
     * @var Collection<int, Ingredient>
     */
    #[ORM\OneToMany(targetEntity: Ingredient::class, mappedBy: 'produit')]
    #[Groups(['produit:read'])]
    private Collection $ingredients;

    public function __construct()
    {
        $this->sauce = new ArrayCollection();
        $this->viande = new ArrayCollection();
        $this->supplement = new ArrayCollection();
        $this->ingredients = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }

    public function getNom(): ?string { return $this->nom; }
    public function setNom(string $nom): static { $this->nom = $nom; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(string $description): static { $this->description = $description; return $this; }

    public function getPrixBase(): ?float { return $this->prix_base; }
    public function setPrixBase(float $prix_base): static { $this->prix_base = $prix_base; return $this; }

    public function isDisponible(): ?bool { return $this->disponible; }
    public function setDisponible(bool $disponible): static { $this->disponible = $disponible; return $this; }

    public function getCreatedAt(): ?\DateTimeImmutable{ return $this->createdAt; }

    public function getCategory(): ?Category { return $this->category; }
    public function setCategory(?Category $category): static { $this->category = $category; return $this; }

    /** @return Collection<int, Sauce> */
    public function getSauce(): Collection { return $this->sauce; }
    public function addSauce(Sauce $sauce): static {
        if (!$this->sauce->contains($sauce)) {
            $this->sauce->add($sauce);
            $sauce->setProduit($this);
        }
        return $this;
    }
    public function removeSauce(Sauce $sauce): static {
        if ($this->sauce->removeElement($sauce) && $sauce->getProduit() === $this) {
            $sauce->setProduit(null);
        }
        return $this;
    }

    /** @return Collection<int, Viande> */
    public function getViande(): Collection { return $this->viande; }
    public function addViande(Viande $viande): static {
        if (!$this->viande->contains($viande)) {
            $this->viande->add($viande);
            $viande->setProduit($this);
        }
        return $this;
    }
    public function removeViande(Viande $viande): static {
        if ($this->viande->removeElement($viande) && $viande->getProduit() === $this) {
            $viande->setProduit(null);
        }
        return $this;
    }

    /** @return Collection<int, Supplement> */
    public function getSupplement(): Collection { return $this->supplement; }
    public function addSupplement(Supplement $supplement): static {
        if (!$this->supplement->contains($supplement)) {
            $this->supplement->add($supplement);
            $supplement->setProduit($this);
        }
        return $this;
    }
    public function removeSupplement(Supplement $supplement): static {
        if ($this->supplement->removeElement($supplement) && $supplement->getProduit() === $this) {
            $supplement->setProduit(null);
        }
        return $this;
    }

    /** @return Collection<int, Ingredient> */
    public function getIngredients(): Collection { return $this->ingredients; }
    public function addIngredient(Ingredient $ingredient): static {
        if (!$this->ingredients->contains($ingredient)) {
            $this->ingredients->add($ingredient);
            $ingredient->setProduit($this);
        }
        return $this;
    }
    public function removeIngredient(Ingredient $ingredient): static {
        if ($this->ingredients->removeElement($ingredient) && $ingredient->getProduit() === $this) {
            $ingredient->setProduit(null);
        }
        return $this;
    }
}

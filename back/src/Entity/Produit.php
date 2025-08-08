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
use App\Entity\TypeProduit;
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
>>>>>>> feature/ValidationDesChamps
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
    #[Groups(['produit:read', 'produit:write', 'category:read'])]
    private ?string $nom = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['produit:read', 'produit:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Assert\NotNull(message: "Le prix de base est obligatoire.")]
    #[Assert\Positive(message: "Le prix doit être un nombre positif.")]
    #[Groups(['produit:read', 'produit:write'])]
    private ?float $prix_base = null;

    #[ORM\Column]
    #[Assert\NotNull(message: "Le champ 'disponible' est obligatoire.")]
    #[Groups(['produit:read', 'produit:write'])]
    private ?bool $disponible = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Assert\NotNull(message: "La date de création est obligatoire.")]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'produits')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull(message: "Le type de produit est obligatoire.")]
    #[Groups(['produit:read', 'produit:write'])]
    private ?TypeProduit $type = null;

    #[ORM\ManyToOne(inversedBy: 'produit')]
    #[Assert\NotNull(message: "La catégorie est obligatoire.")]
    #[Groups(['produit:read', 'produit:write'])]
    private ?Category $category = null;

    /**
     * @var Collection<int, Ingredient>
     */

    #[ORM\OneToMany(mappedBy: 'produit', targetEntity: Ingredient::class, cascade: ['persist', 'remove'])]
    #[Groups(['produit:read', 'produit:write'])]
    private Collection $ingredientsInclus;

    #[ORM\OneToMany(mappedBy: 'produit', targetEntity: ProduitIngredient::class, cascade: ['persist', 'remove'])]
    #[Groups(['produit:read', 'produit:write'])]
    private Collection $produitIngredients;


    public function __construct()
    {
        $this->sauce = new ArrayCollection();
        $this->viande = new ArrayCollection();
        $this->supplement = new ArrayCollection();
        $this->ingredientsInclus = new ArrayCollection();
        $this->produitIngredients = new ArrayCollection();
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

    public function getType(): ?TypeProduit
    {
    return $this->type;
    }

    public function setType(?TypeProduit $type): static
    {
    $this->type = $type;
    return $this;
    }

    public function getCategory(): ?Category { return $this->category; }
    public function setCategory(?Category $category): static { $this->category = $category; return $this; }

    /**
     * @return Collection<int, Ingredient>
     */
    public function getIngredientsInclus(): Collection
    {
        return $this->ingredientsInclus;
    }

    public function addIngredientsInclus(Ingredient $ingredient): static
    {
        if (!$this->ingredientsInclus->contains($ingredient)) {
            $this->ingredientsInclus->add($ingredient);
            $ingredient->setProduit($this);
        }
        return $this;
    }

    public function removeIngredientsInclus(Ingredient $ingredient): static
    {
    if ($this->ingredientsInclus->removeElement($ingredient)) {
        // mettre le produit de l'ingredient à null s'il pointe sur ce produit
        if ($ingredient->getProduit() === $this) {
            $ingredient->setProduit(null);
        }
    }
    return $this;
    }
}

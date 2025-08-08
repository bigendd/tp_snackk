<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\IngredientRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: IngredientRepository::class)]
#[UniqueEntity(fields: ['nom'], message: "Ce nom d'ingredient existe déjà.")]
#[ApiResource(
    normalizationContext: ['groups' => ['ingredient:read']],
    denormalizationContext: ['groups' => ['ingredient:write']]
)]
class Ingredient
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['ingredient:read', 'produit:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 150, unique: true)]
    #[Assert\NotBlank(message: "Le nom de l'ingrédient est obligatoire.")]
    #[Assert\Length(
        min: 2,
        minMessage: "Le nom doit contenir au moins {{ limit }} caractères.",
        max: 150,
        maxMessage: "Le nom ne peut pas dépasser {{ limit }} caractères."
    )]
    #[Groups(['ingredient:read', 'ingredient:write', 'produit:read'])]
    private ?string $nom = null;

    #[ORM\Column]
    #[Assert\NotNull(message: "La disponibilité est obligatoire.")]
    #[Groups(['ingredient:read', 'ingredient:write', 'produit:read'])]
    private ?bool $disponible = null;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['ingredient:read', 'ingredient:write'])]
    private bool $estSupplement = false;

    #[ORM\Column(type: 'float', nullable: true)]
    #[Assert\GreaterThanOrEqual(0)]
    #[Groups(['ingredient:read', 'ingredient:write'])]
    private ?float $prixSupplement = null;

    #[ORM\ManyToOne(targetEntity: Produit::class, inversedBy: 'ingredientsInclus')]
    #[Groups(['ingredient:read', 'ingredient:write'])]
    private ?Produit $produit = null;

    #[ORM\ManyToOne(targetEntity: CategorieIngredient::class, inversedBy: 'ingredients')]
    #[Assert\NotNull(message: "La catégorie de l'ingrédient est obligatoire.")]
    #[Groups(['ingredient:read', 'ingredient:write'])]
    private ?CategorieIngredient $categorie = null;


    // Getters et setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function isDisponible(): ?bool
    {
        return $this->disponible;
    }

    public function setDisponible(bool $disponible): static
    {
        $this->disponible = $disponible;
        return $this;
    }

    public function isEstSupplement(): bool
    {
        return $this->estSupplement;
    }

    public function setEstSupplement(bool $estSupplement): static
    {
        $this->estSupplement = $estSupplement;
        return $this;
    }

    public function getPrixSupplement(): ?float
    {
        return $this->prixSupplement;
    }

    public function setPrixSupplement(?float $prixSupplement): static
    {
        $this->prixSupplement = $prixSupplement;
        return $this;
    }

    public function getProduit(): ?Produit
    {
        return $this->produit;
    }

    public function setProduit(?Produit $produit): static
    {
    // Gérer la relation inverse pour garder la synchro des deux côtés
    if ($this->produit !== $produit) {
        $oldProduit = $this->produit;
        $this->produit = $produit;

        if ($oldProduit !== null) {
            $oldProduit->removeIngredientsInclus($this);
        }

        if ($produit !== null && !$produit->getIngredientsInclus()->contains($this)) {
            $produit->addIngredientsInclus($this);
        }
    }

    return $this;
    }

    public function getCategorie(): ?CategorieIngredient { return $this->categorie; }
    public function setCategorie(?CategorieIngredient $categorie): static { $this->categorie = $categorie; return $this; }

}

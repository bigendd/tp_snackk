<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ProduitIngredientRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProduitIngredientRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['produit_ingredient:read']],
    denormalizationContext: ['groups' => ['produit_ingredient:write']]
)]
class ProduitIngredient
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['produit_ingredient:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'produitIngredients')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['produit_ingredient:read', 'produit_ingredient:write', 'produit:read', 'produit:write'])]
    private ?Produit $produit = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['produit_ingredient:read', 'produit_ingredient:write', 'produit:read', 'produit:write'])]
    private ?Ingredient $ingredient = null;

    #[ORM\Column]
    #[Assert\Positive(message: "La quantité doit être supérieure à zéro.")]
    #[Groups(['produit_ingredient:read', 'produit_ingredient:write', 'produit:read', 'produit:write'])]
    private int $quantite;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getIngredient(): ?Ingredient
    {
        return $this->ingredient;
    }

    public function setIngredient(?Ingredient $ingredient): static
    {
        $this->ingredient = $ingredient;
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
}

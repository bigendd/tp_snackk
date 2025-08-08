<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity]
#[ORM\Table(
    name: "restaurant",
    uniqueConstraints: [
        new ORM\UniqueConstraint(name: "unique_restaurant_nom", columns: ["nom"]),
        new ORM\UniqueConstraint(name: "unique_restaurant_adresse", columns: ["adresse"])
    ]
)]
#[ApiResource(
    normalizationContext: ['groups' => ['restaurant:read']],
    denormalizationContext: ['groups' => ['restaurant:write']]
)]
#[UniqueEntity(fields: ['nom'], message: "Ce nom de restaurant est déjà utilisé.")]
#[UniqueEntity(fields: ['adresse'], message: "Cette adresse est déjà utilisée.")]
class Restaurant
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['restaurant:read', 'borne:read', 'commande_info:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 150, unique: true)]
    #[Groups(['restaurant:read', 'restaurant:write', 'borne:read', 'commande_info:read'])]
    #[Assert\NotBlank]
    #[Assert\Length(
        min: 2,
        minMessage: "Le nom doit contenir au moins {{ limit }} caractères.",
        max: 150,
        maxMessage: "Le nom ne peut pas dépasser {{ limit }} caractères."
    )]
    private ?string $nom = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 5, max: 255)]
    #[Groups(['restaurant:read', 'restaurant:write', 'commande_info:read', 'commande:read'])]
    private ?string $adresse = null;
    
    #[Groups(['restaurant:read', 'restaurant:write'])]
    #[ORM\OneToMany(mappedBy: 'restaurant', targetEntity: Borne::class, cascade: ['persist', 'remove'])]
    private Collection $bornes;

    public function __construct()
    {
        $this->bornes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string { return $this->nom; }
    public function setNom(string $nom): static { $this->nom = $nom; return $this; }
    public function getAdresse(): ?string { return $this->adresse; }
    public function setAdresse(string $adresse): static { $this->adresse = $adresse; return $this; }

    /**
     * @return Collection<int, Borne>
     */
    public function getBornes(): Collection { return $this->bornes; }
    public function addBorne(Borne $borne): static
    {
        if (!$this->bornes->contains($borne)) {
            $this->bornes->add($borne);
            $borne->setRestaurant($this);
        }
        return $this;
    }
    public function removeBorne(Borne $borne): static
    {
        if ($this->bornes->removeElement($borne)) {
            if ($borne->getRestaurant() === $this) {
                $borne->setRestaurant(null);
            }
        }
        return $this;
    }
}

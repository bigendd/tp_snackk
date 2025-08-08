<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

#[ORM\Entity]
#[ORM\Table(
    name: "borne",
    uniqueConstraints: [
        new ORM\UniqueConstraint(name: "unique_borne_nom", columns: ["nom"])
    ]
)]
#[ApiResource(
    normalizationContext: ['groups' => ['borne:read']],
    denormalizationContext: ['groups' => ['borne:write']]
)]
#[UniqueEntity(fields: ['nom'], message: "Ce nom de borne est déjà utilisé.")]
class Borne
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['borne:read', 'commande_info:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 100)]
    #[Groups(['borne:read', 'borne:write', 'commande_info:read', 'commande:read'])]
    private ?string $nom = null;

    #[ORM\ManyToOne(inversedBy: 'bornes')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['borne:read', 'borne:write', 'commande_info:read', 'commande:read'])]
    private ?Restaurant $restaurant = null;

    public function getId(): ?int { return $this->id; }

    public function getNom(): ?string { return $this->nom; }
    public function setNom(string $nom): static { $this->nom = $nom; return $this; }
    
    public function getRestaurant(): ?Restaurant { return $this->restaurant; }
    public function setRestaurant(?Restaurant $restaurant): static { $this->restaurant = $restaurant; return $this; }
}

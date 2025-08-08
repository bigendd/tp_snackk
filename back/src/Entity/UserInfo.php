<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UserInfoRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserInfoRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['userinfo:read']],
    denormalizationContext: ['groups' => ['userinfo:write']]
)]
class UserInfo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['userinfo:read', 'user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    #[Assert\NotBlank]
    #[Groups(['userinfo:read', 'userinfo:write', 'user:read', 'user:write'])]
    private ?string $nom = null;

    #[ORM\Column(length: 150)]
    #[Assert\NotBlank]
    #[Groups(['userinfo:read', 'userinfo:write', 'user:read', 'user:write'])]
    private ?string $prenom = null;

    #[ORM\Column(length: 20)]
    #[Assert\NotBlank]
    #[Assert\Regex(
        pattern: "/^\+?[0-9\s\-]{7,20}$/",
        message: "Numéro de téléphone invalide."
    )]
    #[Groups(['userinfo:read', 'userinfo:write', 'user:read', 'user:write'])]
    private ?string $telephone = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['userinfo:read', 'userinfo:write', 'user:read', 'user:write'])]
    private ?string $adresse = null;

    #[ORM\OneToOne(targetEntity: User::class, inversedBy: 'userInfo', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['userinfo:read', 'userinfo:write'])]
    private ?User $user = null;

    // --- Getters & Setters ---

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

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;
        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(string $telephone): static
    {
        $this->telephone = $telephone;
        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(string $adresse): static
    {
        $this->adresse = $adresse;
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
}

<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UserInfoRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups; 

#[ORM\Entity(repositoryClass: UserInfoRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['userInfo:read']], 
)]
class UserInfo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read'])] 
    private ?int $id = null;

    #[ORM\Column(length: 150)]
    #[Groups(['user:read'])] 
    private ?string $nom = null;

    #[ORM\Column(length: 150)]
    #[Groups(['user:read'])] 
    private ?string $prenom = null;

    #[ORM\Column]
    #[Groups(['user:read'])] 
    private ?int $telephone = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read'])] 
    private ?string $adresse = null;

    #[ORM\OneToOne(inversedBy: 'userInfo', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    public function getId(): ?int { return $this->id; }
    public function getNom(): ?string { return $this->nom; }
    public function setNom(string $nom): static { $this->nom = $nom; return $this; }
    public function getPrenom(): ?string { return $this->prenom; }
    public function setPrenom(string $prenom): static { $this->prenom = $prenom; return $this; }
    public function getTelephone(): ?int { return $this->telephone; }
    public function setTelephone(int $telephone): static { $this->telephone = $telephone; return $this; }
    public function getAdresse(): ?string { return $this->adresse; }
    public function setAdresse(string $adresse): static { $this->adresse = $adresse; return $this; }
    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): static { $this->user = $user; return $this; }
}
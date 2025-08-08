<?php

namespace App\Entity;

<<<<<<< HEAD
=======
use ApiPlatform\Metadata\ApiResource;
use App\Enum\StatutCommande;
>>>>>>> feature/ValidationDesChamps
use App\Repository\CommandeInfoRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CommandeInfoRepository::class)]
<<<<<<< HEAD
=======
#[ApiResource(
    normalizationContext: ['groups' => ['commande_info:read']],
    denormalizationContext: ['groups' => ['commande_info:write']]
)]
>>>>>>> feature/ValidationDesChamps
class CommandeInfo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['commande_info:read'])]
    private ?int $id = null;

<<<<<<< HEAD
    #[ORM\OneToOne(inversedBy: 'commandeInfo')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Commande $commande = null;

    #[ORM\Column]
    private float $totalTTC;

    #[ORM\Column(nullable: true)]
    private ?float $tva = null;

    #[ORM\Column(nullable: true)]
    private ?float $remise = null;

    #[ORM\Column(nullable: true)]
    private ?string $commentaire = null;
=======
    #[ORM\OneToOne(inversedBy: 'commandeInfo', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['commande_info:read', 'commande_info:write'])]
    private ?Commande $commande = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['commande_info:read', 'commande_info:write'])]
    private ?Restaurant $restaurant = null;

    #[ORM\ManyToOne]
    #[Groups(['commande_info:read', 'commande_info:write'])]
    private ?Borne $borne = null;

>>>>>>> feature/ValidationDesChamps

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCommande(): ?Commande { return $this->commande; }
    public function setCommande(?Commande $commande): static
    {
        $this->commande = $commande;
<<<<<<< HEAD
        return $this;
    }

    public function getTotalTTC(): float
    {
        return $this->totalTTC;
    }

    public function setTotalTTC(float $totalTTC): static
    {
        $this->totalTTC = $totalTTC;
        return $this;
    }

    public function getTva(): ?float
    {
        return $this->tva;
    }

    public function setTva(?float $tva): static
    {
        $this->tva = $tva;
        return $this;
    }

    public function getRemise(): ?float
    {
        return $this->remise;
    }

    public function setRemise(?float $remise): static
    {
        $this->remise = $remise;
        return $this;
    }

    public function getCommentaire(): ?string
    {
        return $this->commentaire;
    }

    public function setCommentaire(?string $commentaire): static
    {
        $this->commentaire = $commentaire;
=======
>>>>>>> feature/ValidationDesChamps
        return $this;
    }

    public function getRestaurant(): ?Restaurant { return $this->restaurant; }
    public function setRestaurant(?Restaurant $restaurant): static
    {
        $this->restaurant = $restaurant;
        return $this;
    }

    public function getBorne(): ?Borne { return $this->borne; }
    public function setBorne(?Borne $borne): static
    {
        $this->borne = $borne;
        return $this;
    }

}

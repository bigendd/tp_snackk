<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Enum\ModeConsommation;
use App\Enum\MoyenDePaiment;
use App\Repository\CommandeRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\CommandeProduit;
use App\Entity\User;
use App\Entity\CommandeInfo;
use App\Enum\StatutCommande;

#[ORM\Entity(repositoryClass: CommandeRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['commande:read']],
    denormalizationContext: ['groups' => ['commande:write']]
)]
class Commande
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['commande:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(['commande:read', 'commande:write'])]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: 'string', enumType: StatutCommande::class)]
    #[Assert\NotNull]
    #[Groups(['commande:read', 'commande:write'])]
    private ?StatutCommande $statut = null;

    #[ORM\Column(nullable: true, enumType: ModeConsommation::class)]
    #[Groups(['commande:read', 'commande:write'])]
    private ?ModeConsommation $mode_cons = null;

    #[ORM\Column(enumType: MoyenDePaiment::class)]
    #[Assert\NotNull(message: "Le moyen de paiement est obligatoire")]
    #[Groups(['commande:read', 'commande:write'])]
    private ?MoyenDePaiment $moyen_paiment = null;

    #[ORM\ManyToOne(inversedBy: 'commandes')]
    #[Groups(['commande:read', 'commande:write'])]
    private ?User $user = null;

    #[ORM\OneToMany(mappedBy: 'commande', targetEntity: CommandeProduit::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Assert\Valid]
    #[Groups(['commande:read', 'commande:write'])]
    private Collection $commandeProduits;

    #[ORM\OneToOne(mappedBy: 'commande', targetEntity: CommandeInfo::class, cascade: ['persist', 'remove'])]
    #[Groups(['commande:read', 'commande:write'])]
    private ?CommandeInfo $commandeInfo = null;

    public function __construct()
    {
        $this->commandeProduits = new ArrayCollection();
        $this->date = new \DateTimeImmutable();
        $this->statut = StatutCommande::EN_ATTENTE;
        $this->montantTotal = 0.0;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;
        return $this;
    }

    public function getStatut(): ?StatutCommande
    {
        return $this->statut;
    }

    public function setStatut(StatutCommande $statut): static
    {
        $this->statut = $statut;
        return $this;
    }

    public function getModeCons(): ?ModeConsommation
    {
        return $this->mode_cons;
    }

    public function setModeCons(?ModeConsommation $mode_cons): static
    {
        $this->mode_cons = $mode_cons;
        return $this;
    }

    public function getMoyenPaiment(): ?MoyenDePaiment
    {
        return $this->moyen_paiment;
    }

    public function setMoyenPaiment(MoyenDePaiment $moyen_paiment): static
    {
        $this->moyen_paiment = $moyen_paiment;
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

    /**
     * @return Collection<int, CommandeProduit>
     */
    public function getCommandeProduits(): Collection
    {
        return $this->commandeProduits;
    }

    public function addCommandeProduit(CommandeProduit $cp): static
    {
        if (!$this->commandeProduits->contains($cp)) {
            $this->commandeProduits->add($cp);
            $cp->setCommande($this);
        }
        return $this;
    }

    public function removeCommandeProduit(CommandeProduit $cp): static
    {
        if ($this->commandeProduits->removeElement($cp)) {
            if ($cp->getCommande() === $this) {
                $cp->setCommande(null);
            }
        }
        return $this;
    }

    public function getCommandeInfo(): ?CommandeInfo
    {
        return $this->commandeInfo;
    }

    public function setCommandeInfo(?CommandeInfo $info): static
    {
        $this->commandeInfo = $info;
        if ($info && $info->getCommande() !== $this) {
            $info->setCommande($this);
        }
        return $this;
    }

}

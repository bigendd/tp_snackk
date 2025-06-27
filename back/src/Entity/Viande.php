<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ViandeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ViandeRepository::class)]
#[ApiResource]
class Viande
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    public function getId(): ?int
    {
        return $this->id;
    }
}

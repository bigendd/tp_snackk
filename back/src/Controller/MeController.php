<?php
// src/Controller/Api/MeController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

class MeController extends AbstractController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function __invoke(UserInterface $user): JsonResponse
    {
        $userInfo = $user->getUserInfo();

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'nom' => $userInfo?->getNom(),
            'prenom' => $userInfo?->getPrenom(),
            'image' => $userInfo?->getImage(),
        ]);
    }
}
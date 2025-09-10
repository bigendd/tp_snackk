<?php

namespace App\Controller;

use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

class LogoutController extends AbstractController
{
    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(UserInterface $user, RefreshTokenManagerInterface $refreshTokenManager): JsonResponse
    {
        $refreshToken = $refreshTokenManager->getLastFromUsername($user->getUserIdentifier());

        if ($refreshToken) {
            $refreshTokenManager->delete($refreshToken);
        }

        return new JsonResponse(['message' => 'Déconnexion réussie.'], 200);
    }
}
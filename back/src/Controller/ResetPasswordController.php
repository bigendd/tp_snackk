<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\ResetPasswordService;

class ResetPasswordController extends AbstractController
{
    public function __construct(private ResetPasswordService $resetService) {}

    #[Route('/api/reset-password', methods: ['POST'])]
    public function __invoke(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'] ?? null;
        $password = $data['password'] ?? null;

        if (!$token || !$password) {
            return new JsonResponse(['error' => 'token and password required'], 400);
        }

        if (strlen($password) < 8) {
            return new JsonResponse(['error' => 'Password too short'], 400);
        }

        $ok = $this->resetService->resetPassword($token, $password);

        if (! $ok) {
            return new JsonResponse(['error' => 'Token invalide ou expiré'], 400);
        }

        return new JsonResponse(['message' => 'Mot de passe réinitialisé avec succès'], 200);
    }
}

<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\ResetPasswordService;
use App\Service\PasswordValidator;

class ResetPasswordController extends AbstractController
{
    public function __construct(
        private ResetPasswordService $resetService, 
        private PasswordValidator $passwordValidator
        ){}

    #[Route('/api/reset-password', methods: ['POST'])]
    public function __invoke(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'] ?? null;
        $password = $data['password'] ?? null;

        if (!$token || !$password) {
            return new JsonResponse(['error' => 'token and password required'], 400);
        }

         // Validation sécurisée du mot de passe
        if ($error = $this->passwordValidator->validate($password)) {
            return new JsonResponse(['error' => $error], 400);
        }

         // Réinitialisation du mot de passe

        $ok = $this->resetService->resetPassword($token, $password);

        if (! $ok) {
            return new JsonResponse(['error' => 'Token invalide ou expiré'], 400);
        }

        return new JsonResponse(['message' => 'Mot de passe réinitialisé avec succès'], 200);
    }
}

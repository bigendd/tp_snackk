<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserRepository;
use App\Service\ResetPasswordService;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mime\Address;

class ForgotPasswordController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepo,
        private ResetPasswordService $resetService,
        private MailerInterface $mailer
    ) {}

    #[Route('/api/forgot-password', methods: ['POST'])]
    public function __invoke(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        if ($email) {
            $user = $this->userRepo->findOneBy(['email' => $email]);
            if ($user) {
                $rawToken = $this->resetService->createResetToken($user);

                $link = "http://localhost:3000/reset-password?token=" . $rawToken;

                $message = (new TemplatedEmail())
                    ->from(new Address('exemple@domaine.com', 'APP SNACKK')) 
                    ->to($user->getEmail())
                    ->subject('Réinitialisation de votre mot de passe')
                    ->htmlTemplate('emails/reset_password.html.twig')
                    ->context(['resetLink' => $link]);

                $this->mailer->send($message);
            }
        }

        return new JsonResponse([
            'message' => "Si l'email existe, un lien a été envoyé.", 
            'token' => $rawToken // à retirer en production, juste pour les tests
        ], 200);
    }
}

<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\PasswordValidator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class RegisterController extends AbstractController
{
    public function __construct(private PasswordValidator $passwordValidator) {}

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Email and password required'], 400);
        }

        // Validation sécurisée du mot de passe
        if ($error = $this->passwordValidator->validate($password)) {
            return new JsonResponse(['error' => $error], 400);
        }

        // Vérifie si l'utilisateur existe déjà
        $existingUser = $em->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'Email already used'], 400);
        }

        $user = new User();
        $user->setEmail($email);
        $hashedPassword = $passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        // Par exemple, tu peux donner un rôle par défaut
        $user->setRoles(['ROLE_USER']);

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => 'User created'], 201);
    }
}

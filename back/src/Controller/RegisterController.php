<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserInfo;
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
        $userInfoData = $data['userInfo'] ?? null;

        if (!$email || !$password || !$userInfoData) {
            return new JsonResponse(['error' => 'Email, password and userInfo required'], 400);
        }

        if ($error = $this->passwordValidator->validate($password)) {
            return new JsonResponse(['error' => $error], 400);
        }

        $existingUser = $em->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'Email already used'], 400);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setPassword($passwordHasher->hashPassword($user, $password));
        $user->setRoles(['ROLE_USER']);

        $userInfo = new UserInfo();
        $userInfo->setNom($userInfoData['nom'] ?? '');
        $userInfo->setPrenom($userInfoData['prenom'] ?? '');
        $userInfo->setTelephone($userInfoData['telephone'] ?? '');
        $userInfo->setAdresse($userInfoData['adresse'] ?? '');
        $userInfo->setUser($user);

        $em->persist($user);
        $em->persist($userInfo);
        $em->flush();

        return new JsonResponse(['message' => 'User created'], 201);
    }
}

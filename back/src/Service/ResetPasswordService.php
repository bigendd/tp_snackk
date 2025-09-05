<?php

namespace App\Service;

use App\Entity\PasswordResetToken;
use App\Repository\PasswordResetTokenRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\UserRepository;
use App\Entity\User;
use App\Entity\RefreshToken;

class ResetPasswordService
{
    public function __construct(
        private EntityManagerInterface $em,
        private PasswordResetTokenRepository $tokenRepo,
        private UserPasswordHasherInterface $hasher,
        private UserRepository $userRepo
    ) {}

    public function createResetToken(User $user): string
    {
        $raw = bin2hex(random_bytes(32));
        $hash = hash('sha256', $raw);

        $prt = new PasswordResetToken();
        $prt->setTokenHash($hash);
        $prt->setUser($user);
        $prt->setExpiresAt(new \DateTimeImmutable('+1 hour'));
        $prt->setUsed(false);

        $this->em->persist($prt);
        $this->em->flush();

        return $raw; // on retourne le token brut pour l’email
    }

    public function validateToken(string $raw): ?PasswordResetToken
    {
        $hash = hash('sha256', $raw);
        $token = $this->tokenRepo->findOneBy(['tokenHash' => $hash]);

        if (!$token) return null;
        if ($token->isUsed()) return null;
        if ($token->getExpiresAt() < new \DateTimeImmutable()) return null;

        return $token;
    }

    public function resetPassword(string $rawToken, string $plainPassword): bool
    {
        $token = $this->validateToken($rawToken);
        if (!$token) return false;

        $user = $token->getUser();
        $user->setPassword($this->hasher->hashPassword($user, $plainPassword));
        $user->setPasswordChangedAt(new \DateTimeImmutable());

        $token->setUsed(true);

        // Supprimer les refresh tokens liés à cet utilisateur
        $this->em->createQueryBuilder()
            ->delete(RefreshToken::class, 'rt')
            ->where('rt.username = :username')
            ->setParameter('username', $user->getUserIdentifier())
            ->getQuery()
            ->execute();

        $this->em->persist($user);
        $this->em->persist($token);
        $this->em->flush();

        return true;
    }
}

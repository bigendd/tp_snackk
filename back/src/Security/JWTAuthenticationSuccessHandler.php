<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

#[AsEventListener(event: 'lexik_jwt_authentication.on_authentication_success', method: '__invoke')]
class JWTAuthenticationSuccessHandler
{
    public function __invoke(AuthenticationSuccessEvent $event): void
    {
        $data = $event->getData(); // contient "token"
        $response = $event->getResponse();

        $token = $data['token'] ?? null;

        if ($token) {
            $accessCookie = Cookie::create('token')
                ->withValue($token)
                ->withHttpOnly(true)
                ->withSecure(false) // ⚠️ mettre true en prod
                ->withSameSite('Strict')
                ->withPath('/')
                ->withExpires(time() + 3600); // 1h

            $response->headers->setCookie($accessCookie);
            unset($data['token']); // supprimer du JSON
        }

        // Réponse finale nettoyée
        $data['message'] = 'Connexion réussie';
        $event->setData($data);
    }
}

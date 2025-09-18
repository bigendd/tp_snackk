<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpFoundation\Cookie;

class RefreshTokenCookieListener
{
    public function onKernelResponse(ResponseEvent $event): void
    {
        $request = $event->getRequest();

        // Vérifie si la requête est celle du refresh token
        if ($request->getPathInfo() === '/api/token/refresh') {
            // Récupère le contenu JSON de la réponse
            $content = json_decode($event->getResponse()->getContent(), true);
            $refreshToken = $content['refresh_token'] ?? null;

            if ($refreshToken) {
                // Crée le cookie sécurisé
                $cookie = Cookie::create('refresh_token')
                    ->withValue($refreshToken)
                    ->withHttpOnly(true)
                    ->withSecure(false) // ⚠️ Mettre true en production (HTTPS)
                    ->withSameSite('Strict')
                    ->withPath('/')
                    ->withExpires(strtotime('+7 days'));

                // Ajoute le cookie à la réponse
                $event->getResponse()->headers->setCookie($cookie);

                // Optionnel : retire le refresh_token du corps JSON
                unset($content['refresh_token']);
                $event->getResponse()->setContent(json_encode($content));
            }
        }
    }
}
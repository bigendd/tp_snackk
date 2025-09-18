<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpFoundation\Cookie;

class LoginCookieListener
{
    public function onKernelResponse(ResponseEvent $event): void
    {
        $request = $event->getRequest();

        // Vérifie si la requête est celle du login
        if ($request->getPathInfo() === '/api/login') {
            $content = json_decode($event->getResponse()->getContent(), true);

            if (isset($content['refresh_token'])) {
                $refreshToken = $content['refresh_token'];

                $cookie = Cookie::create('refresh_token')
                    ->withValue($refreshToken)
                    ->withHttpOnly(true)
                    ->withSecure(false) // true en production
                    ->withSameSite('Strict')
                    ->withPath('/')
                    ->withExpires(strtotime('+7 days'));

                $event->getResponse()->headers->setCookie($cookie);

                // Retire le refresh_token du JSON
                unset($content['refresh_token']);
                $event->getResponse()->setContent(json_encode($content));
            }
        }
    }
}
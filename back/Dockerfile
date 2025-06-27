FROM php:8.2-apache

# Installer les dépendances système nécessaires pour les extensions PHP
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    unzip zip git curl \
 && docker-php-ext-install pdo pdo_mysql mbstring xml zip

# Installer MongoDB PHP extension

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copier la configuration Apache personnalisée
COPY ./apache.conf /etc/apache2/sites-available/000-default.conf

# Activer mod_rewrite pour les URLs Symfony
RUN a2enmod rewrite

# Définir le dossier de travail par défaut
WORKDIR /var/www/html

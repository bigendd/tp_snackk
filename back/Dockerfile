FROM php:8.2-apache

# Installer les dépendances système nécessaires pour les extensions PHP
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    unzip zip git curl \
    cron \
 && docker-php-ext-install pdo pdo_mysql mbstring xml zip \
 && apt-get clean

# Installer MongoDB PHP extension

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copier la configuration Apache personnalisée
COPY ./apache.conf /etc/apache2/sites-available/000-default.conf

# Activer mod_rewrite pour les URLs Symfony
RUN a2enmod rewrite

# 🔧 Créer le dossier de log pour cron
RUN mkdir -p /var/log


# Copier le fichier cron
COPY crontab.txt /etc/cron.d/refresh-cron
RUN chmod 0644 /etc/cron.d/refresh-cron 

# Définir le dossier de travail par défaut
WORKDIR /var/www/html




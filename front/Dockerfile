# Utilise une image Node officielle pour le build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Utilise Nginx pour servir l'app en production
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Copie une config nginx personnalisée si besoin
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
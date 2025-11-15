# Dockerfile
FROM node:20-alpine

# Dossier de travail dans le container
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer uniquement les deps de prod
RUN npm install

# Copier le reste du code
COPY . .


# Démarrage
CMD ["node", "index.js"]
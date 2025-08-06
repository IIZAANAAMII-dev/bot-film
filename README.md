# 🎬 CineBot - Bot de soirées cinéma

Un bot Discord puissant et bien organisé pour organiser des soirées cinéma avec Teleparty. Créé avec ❤️ par **IIZAANAAMII**.

## 🏗️ Structure du projet

```
bot-film/
├── src/
│   ├── commands/        # Commandes slash
│   ├── events/          # Gestionnaires d'événements
│   ├── handlers/        # Gestionnaires divers
│   ├── utils/           # Utilitaires
│   └── config/          # Configuration
├── .env                 # Variables d'environnement
├── index.js             # Point d'entrée du bot
└── package.json         # Dépendances et scripts
```

## ✨ Fonctionnalités

- Création de séances de visionnage avec la commande `/films`
- Gestion automatique des participants avec réactions
- Attribution d'un rôle "Cinéphile" aux participants
- Interface intuitive avec modaux Discord

## 📋 Prérequis

- Node.js v16.9.0 ou plus récent
- Un compte Discord avec un bot configuré
  - SERVER MEMBERS INTENT
  - MESSAGE CONTENT INTENT
- Git (recommandé pour le contrôle de version)

## 🚀 Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/IIZAANAAMII/cinebot-discord.git
   cd cinebot-discord
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   - Copiez `.env.example` vers `.env`
   - Remplissez les informations nécessaires
   ```bash
   cp .env.example .env
   ```

4. Déployez les commandes :
   ```bash
   npm run deploy
   ```

5. Lancez le bot :
   ```bash
   npm start
   ```

   Pour le développement avec rechargement automatique :
   ```bash
   npm run dev
   ```

## 🔧 Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Token de votre bot Discord
DISCORD_TOKEN=votre_token_ici

# ID de l'application Discord
CLIENT_ID=votre_client_id_ici

# ID du serveur (optionnel pour le développement)
GUILD_ID=votre_serveur_id_ici
```

## 🛠️ Commandes disponibles

- `/film` - Crée une nouvelle séance de film

## 🎥 Utilisation

1. Utilisez la commande `/films` dans un salon Discord
2. Remplissez le formulaire avec les détails du film/série
3. Suivez les instructions pour créer un lien Teleparty
4. Partagez le lien Teleparty quand vous y êtes invité
5. Les autres utilisateurs peuvent cliquer sur pour participer
5. Les autres utilisateurs peuvent cliquer sur ✅ pour participer

## Commandes

- `/films` - Créer une nouvelle séance de film

## Configuration avancée

### Ajouter le bot à votre serveur

1. Allez sur le [portail développeur Discord](https://discord.com/developers/applications)
2. Sélectionnez votre application
3. Allez dans l'onglet "OAuth2" > "URL Generator"
4. Cochez les permissions nécessaires :
   - `applications.commands`
   - `sendMessages`
   - `readMessageHistory`
   - `addReactions`
   - `manageRoles`
5. Copiez l'URL générée et ouvrez-la dans votre navigateur
6. Sélectionnez le serveur où ajouter le bot

## 👤 Crédits

Développé avec passion par **IIZAANAAMII**

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';

const commands = [
  new SlashCommandBuilder()
    .setName('film')
    .setDescription('🎬 Crée une séance Teleparty pour regarder un film ensemble !')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Remplace par l'ID de ton serveur (guild) et ton client (bot)
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

(async () => {
  try {
    // D'abord, supprimer toutes les commandes existantes (globales et de guilde)
    console.log('🗑️ Suppression des anciennes commandes...');
    
    // Supprimer les commandes de guilde
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: [] }
    );
    
    // Supprimer les commandes globales
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: [] }
    );
    
    console.log('✅ Anciennes commandes supprimées !');

    // Ensuite, déployer la nouvelle commande UNIQUEMENT sur le serveur spécifique
    console.log('⏳ Déploiement de la commande /film...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log('✅ Commande /film déployée avec succès sur le serveur !');
  } catch (error) {
    console.error('❌ Erreur de déploiement :', error);
  }
})();

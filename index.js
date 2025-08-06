import 'dotenv/config';
import { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle, 
  Events, 
  Collection 
} from 'discord.js';
// server.js
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🟢 Ping réussi depuis Render !');
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

// Configuration du client Discord
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

// ID du salon où le bot est autorisé à fonctionner
const ALLOWED_CHANNEL_ID = '1400848476425687132'; // Remplacez par l'ID de votre salon

client.commands = new Collection();
client.participants = new Map();

// Gestion de la connexion du bot
client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// Gestion des interactions
client.on(Events.InteractionCreate, async (interaction) => {
  // Vérifier si l'interaction vient du bon salon
  if (interaction.channelId !== ALLOWED_CHANNEL_ID) {
    if (interaction.isCommand() || interaction.isButton() || interaction.isModalSubmit()) {
      return await interaction.reply({
        content: '❌ Ce bot ne peut être utilisé que dans le salon dédié aux séances de film.',
        ephemeral: true
      });
    }
    return; // Ignorer les autres types d'interactions
  }

  // Commande /film
  if (interaction.isChatInputCommand() && interaction.commandName === 'film') {
    try {
      const embed = new EmbedBuilder()
        .setTitle('🎬 Guide d\'utilisation de Teleparty')
        .setDescription(
          "✨ **Bienvenue dans l'outil de création de soirées cinéma !** ✨\n\n" +
          "Voici comment créer une séance de visionnage :\n\n" +
          "1️⃣ **Installe** l'extension [Teleparty](https://www.teleparty.com/) (anciennement Netflix Party)\n" +
          "2️⃣ **Lance** ton film ou ta série préférée\n" +
          "3️⃣ **Clique** sur l'icône Teleparty pour démarrer une session\n" +
          "4️⃣ **Partage** ta séance avec tes amis en cliquant ci-dessous !"
        )
        .setColor('#9147FF')
        .setThumbnail('https://www.marseilletourisme.fr/media/filer_public_thumbnails/filer_public/2021/01/21/blason_marseille_s1J1EsI.jpg__400x400_q85_subsampling-2.jpg')
        .setFooter({ 
          text: '🎥 Créateur - iizaanaamii',
          iconURL: 'https://www.marseilletourisme.fr/media/filer_public_thumbnails/filer_public/2021/01/21/blason_marseille_s1J1EsI.jpg__400x400_q85_subsampling-2.jpg'
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ouvrir_modal')
          .setLabel('🎥 Créer une séance')
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.reply({ 
        embeds: [embed], 
        components: [row], 
        ephemeral: true 
      });
    } catch (error) {
      console.error('Erreur lors de l\'exécution de /film :', error);
      if (!interaction.replied) {
        await interaction.reply({ 
          content: '❌ Une erreur est survenue lors de l\'exécution de la commande.', 
          ephemeral: true 
        });
      }
    }
    return;
  }

  // Gestion du bouton pour ouvrir la modale
  if (interaction.isButton() && interaction.customId === 'ouvrir_modal') {
    try {
      const modal = new ModalBuilder()
        .setCustomId('formulaire_film')
        .setTitle('Créer une séance Teleparty');

      const filmInput = new TextInputBuilder()
        .setCustomId('film')
        .setLabel('Nom du film ou série')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const plateformeInput = new TextInputBuilder()
        .setCustomId('plateforme')
        .setLabel('Plateforme (ex: Netflix)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const lienInput = new TextInputBuilder()
        .setCustomId('lien')
        .setLabel('Lien Teleparty')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(filmInput),
        new ActionRowBuilder().addComponents(plateformeInput),
        new ActionRowBuilder().addComponents(lienInput)
      );

      await interaction.showModal(modal);
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de la modale :', error);
      if (!interaction.replied) {
        await interaction.reply({ 
          content: '❌ Une erreur est survenue lors de l\'ouverture du formulaire.', 
          ephemeral: true 
        });
      }
    }
    return;
  }

  // Gestion de la soumission du formulaire
  if (interaction.isModalSubmit() && interaction.customId === 'formulaire_film') {
    try {
      const film = interaction.fields.getTextInputValue('film');
      const plateforme = interaction.fields.getTextInputValue('plateforme');
      const lien = interaction.fields.getTextInputValue('lien');

      // Valider le lien Teleparty
      if (!lien.includes('teleparty.com') && !lien.includes('netflix.com') && !lien.includes('primevideo.com')) {
        return await interaction.reply({
          content: '❌ Le lien fourni ne semble pas être un lien Teleparty valide.',
          ephemeral: true
        });
      }

      // Créer un bel embed pour l'annonce de la séance
      const embed = new EmbedBuilder()
        .setTitle(`🎬 𝗦𝗢𝗜𝗥𝗘́𝗘 𝗙𝗜𝗟𝗠 : ${film.toUpperCase()}  🎬`)
        .setDescription("🎉 Une nouvelle séance a été créée ! Rejoignez-nous pour regarder ensemble.\n\n" +
                     "👇 Cliquez sur le bouton ci-dessous pour participer !")
        .setColor('#9147FF')
        .setThumbnail('https://www.marseilletourisme.fr/media/filer_public_thumbnails/filer_public/2021/01/21/blason_marseille_s1J1EsI.jpg__400x400_q85_subsampling-2.jpg')
        .addFields(
          { 
            name: '📽️ 𝗧𝗜𝗧𝗥𝗘', 
            value: `\`\`\`${film}\`\`\``, 
            inline: true 
          },
          { 
            name: '📺 𝗣𝗟𝗔𝗧𝗘𝗙𝗢𝗥𝗠𝗘', 
            value: `\`\`\`${plateforme}\`\`\``, 
            inline: true 
          },
          { 
            name: '👤 𝗢𝗥𝗚𝗔𝗡𝗜𝗦𝗔𝗧𝗘𝗨𝗥', 
            value: `> ${interaction.user.toString()}`,
            inline: true 
          },
          { 
            name: '👥 𝗣𝗔𝗥𝗧𝗜𝗖𝗜𝗣𝗔𝗡𝗧𝗦', 
            value: '> *Aucun participant pour le moment*',
            inline: true 
          }
        )
        .setTimestamp()
        .setFooter({ 
          text: '🎬 CineBot - Regardez des films ensemble !',
          iconURL: 'https://www.marseilletourisme.fr/media/filer_public_thumbnails/filer_public/2021/01/21/blason_marseille_s1J1EsI.jpg__400x400_q85_subsampling-2.jpg'
        });

      // Créer un identifiant unique pour cette session
      const sessionId = `session_${Date.now()}`;
      
      // Stocker les informations de la session
      if (!client.sessions) client.sessions = new Map();
      client.sessions.set(sessionId, {
        lien,
        participants: new Set(),
        messageId: null,
        salonId: null
      });

      // Créer les composants du message
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`join_${sessionId}`)
          .setLabel('🎬 Rejoindre la séance')
          .setStyle(ButtonStyle.Success)
      );
      
      // Trouver le salon de discussion approprié
      const salon = interaction.guild.channels.cache.find(
        channel => 
          (channel.name.includes('soirees-cine') || 
           channel.name.includes('général') || 
           channel.name.includes('general')) &&
          channel.type === 0 // Type 0 = salon textuel
      ) || interaction.channel; // Fallback sur le salon actuel

      try {
        const message = await salon.send({ 
          content: `🎬 **Nouvelle séance de film organisée par <@${interaction.user.id}> !**`,
          embeds: [embed], 
          components: [row] 
        });
        
        // Mettre à jour les informations de la session avec l'ID du message
        const session = client.sessions.get(sessionId);
        if (session) {
          session.messageId = message.id;
          session.salonId = salon.id;
        }
        
        await interaction.reply({ 
          content: `✅ Votre séance a été créée avec succès dans ${salon} !`, 
          ephemeral: true 
        });
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message de séance :', error);
        await interaction.reply({
          content: '❌ Impossible de publier la séance dans le salon. Vérifiez les permissions du bot.',
          ephemeral: true
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création de la séance :', error);
      if (!interaction.replied) {
        await interaction.reply({ 
          content: '❌ Une erreur est survenue lors de la création de la séance.', 
          ephemeral: true 
        });
      }
    }
    return;
  }

  // Gestion du bouton pour rejoindre une séance
  if (interaction.isButton() && interaction.customId.startsWith('join_')) {
    try {
      const sessionId = interaction.customId.replace('join_', '');
      const session = client.sessions?.get(sessionId);
      
      if (!session) {
        return await interaction.reply({
          content: '❌ Cette session n\'existe plus ou a expiré.',
          ephemeral: true
        });
      }
      
      const { lien, participants, messageId, salonId } = session;
      const userId = interaction.user.id;
      
      // Vérifier si l'utilisateur a déjà rejoint
      if (participants.has(userId)) {
        return await interaction.reply({
          content: `✅ Vous avez déjà rejoint cette séance ! [Cliquez ici pour accéder au film](${lien})`,
          ephemeral: true
        });
      }
      
      // Ajouter l'utilisateur aux participants
      participants.add(userId);
      
      // Mettre à jour le message avec la nouvelle liste des participants
      const salon = interaction.guild.channels.cache.get(salonId);
      if (salon) {
        try {
          const message = await salon.messages.fetch(messageId);
          if (message) {
            const embed = message.embeds[0];
            const participantsList = Array.from(participants).map(id => `<@${id}>`).join('\n');
            
            // Mettre à jour l'embed avec la nouvelle liste des participants
            const updatedEmbed = EmbedBuilder.from(embed);
            updatedEmbed.spliceFields(3, 1, { 
              name: '👥 𝗣𝗔𝗥𝗧𝗜𝗖𝗜𝗣𝗔𝗡𝗧𝗦', 
              value: participantsList || '> *Aucun participant pour le moment*',
              inline: true 
            });
            
            await message.edit({ embeds: [updatedEmbed] });
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du message :', error);
        }
      }
      
      // Donner le rôle Cinéphile à l'utilisateur
      try {
        let role = interaction.guild.roles.cache.find(
          r => r.name.toLowerCase() === 'cinéphile' || 
               r.name.toLowerCase() === 'cinephile' ||
               r.name.toLowerCase() === 'cinéphiles' ||
               r.name.toLowerCase() === 'cinephiles'
        );
        
        // Si le rôle n'existe pas, le créer
        if (!role) {
          role = await interaction.guild.roles.create({
            name: 'Cinéphile',
            color: '#9147FF',
            permissions: [],
            reason: 'Rôle pour les utilisateurs participant aux séances de film',
            mentionable: true
          });
        }
        
        // Donner le rôle à l'utilisateur
        const member = await interaction.guild.members.fetch(userId);
        if (!member.roles.cache.has(role.id)) {
          await member.roles.add(role);
          
          // Envoyer un message de confirmation en MP
          try {
            const dmChannel = await interaction.user.createDM();
            await dmChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor('#9147FF')
                  .setTitle('🎬 Bienvenue dans la séance de cinéma !')
                  .setDescription(`Vous avez rejoint la séance avec succès !\n\n` +
                    `🎥 **Lien pour regarder le film :** [Cliquez ici](${lien})\n` +
                    `👥 **Vous faites maintenant partie des Cinéphiles **\n` +
                    `Vous avez reçu le rôle cinéphiles sur le serveur.`)
                  .setTimestamp()
                  .setFooter({ text: '🎬 Créateur - iizaanaamii - Profitez du film !' })
              ]
            });
          } catch (dmError) {
            console.error('Erreur lors de l\'envoi du message en MP :', dmError);
          }
        }
      } catch (roleError) {
        console.error('Erreur lors de l\'attribution du rôle :', roleError);
      }
      
      // Répondre à l'interaction
      await interaction.reply({
        content: `✅ Vous avez rejoint la séance avec succès ! [Cliquez ici pour accéder au film](${lien})`,
        ephemeral: true
      });
      
    } catch (error) {
      console.error('Erreur lors de la gestion du bouton Rejoindre :', error);
      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Une erreur est survenue lors de votre tentative de rejoindre la séance.',
          ephemeral: true
        });
      }
    }
    return;
  }
  
  // Ancien gestionnaire (à supprimer après vérification)
  if (interaction.isButton() && interaction.customId.startsWith('rejoindre_')) {
    try {
      const message = await interaction.channel.messages.fetch(interaction.message.id);
      const embed = EmbedBuilder.from(message.embeds[0]);

      // Initialiser le stockage des participants pour ce message s'il n'existe pas
      if (!client.participants.has(message.id)) {
        client.participants.set(message.id, new Set());
      }

      const participants = client.participants.get(message.id);
      const userId = interaction.user.id;
      
      if (!participants.has(userId)) {
        // Ajouter l'utilisateur aux participants
        participants.add(userId);
        
        // Mettre à jour l'embed avec la nouvelle liste des participants
        const noms = Array.from(participants).map(id => `<@${id}>`).join('\n');
        // Mettre à jour la liste des participants avec un beau format
        const participantsList = noms 
          ? noms.split('\n').map((name, index) => `${index + 1}. ${name}`).join('\n')
          : '> *Aucun participant pour le moment*';
          
        embed.spliceFields(4, 1, { 
          name: '👥 𝗣𝗔𝗥𝗧𝗜𝗖𝗜𝗣𝗔𝗡𝗧𝗦', 
          value: participantsList,
          inline: true
        });
        
        // Mettre à jour le compteur dans le titre si nécessaire
        const currentTitle = embed.data.title || '';
        const newTitle = currentTitle.replace(/\(\d+\)\s*$|$/, `(${participants.size})`);
        if (currentTitle !== newTitle) {
          embed.setTitle(newTitle);
        }
        
        // Mettre à jour le message avec la nouvelle liste
        await message.edit({ embeds: [embed] });

        // Vérifier et créer le rôle Cinéphile s'il n'existe pas
        try {
          let role = interaction.guild.roles.cache.find(
            r => r.name.toLowerCase() === 'cinéphile' || 
                 r.name.toLowerCase() === 'cinephile' ||
                 r.name.toLowerCase() === 'cinéphiles' ||
                 r.name.toLowerCase() === 'cinephiles'
          );
          
          // Si le rôle n'existe pas, le créer
          if (!role) {
            role = await interaction.guild.roles.create({
              name: 'Cinéphile',
              color: '#9147FF',
              permissions: [],
              reason: 'Rôle pour les utilisateurs participant aux séances de film',
              mentionable: true
            });
            
            console.log(`✅ Rôle "${role.name}" créé avec succès !`);
          }
          
          // Attribuer le rôle à l'utilisateur
          const member = await interaction.guild.members.fetch(userId);
          if (!member.roles.cache.has(role.id)) {
            await member.roles.add(role);
            
            // Message de bienvenue avec le rôle
            const welcomeEmbed = new EmbedBuilder()
              .setColor('#9147FF')
              .setTitle('🎉 Bienvenue dans la communauté des Cinéphiles !')
              .setDescription(`Félicitations ${member.user.username} ! 🎬\n` +
                `Tu as reçu le rôle **${role.name}** pour avoir participé à une séance de film.\n\n` +
                'Profite de ton statut de cinéphile et à bientôt pour de nouvelles séances !')
              .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
              .setTimestamp()
              .setFooter({ 
                text: '🎥 Créateur - iizaanaamii',
                iconURL: 'https://www.marseilletourisme.fr/media/filer_public_thumbnails/filer_public/2021/01/21/blason_marseille_s1J1EsI.jpg__400x400_q85_subsampling-2.jpg'
              });
              
            await interaction.user.send({ embeds: [welcomeEmbed] });
            
            await interaction.reply({ 
              content: `🎬 Bravo ! Tu as rejoint la séance et reçu le rôle **${role.name}** !`,
              ephemeral: true 
            });
            return;
          }
          
          await interaction.reply({ 
            content: '🎟️ Tu as rejoint la séance !',
            ephemeral: true 
          });
          
        } catch (roleError) {
          console.error('Erreur lors de l\'ajout du rôle :', roleError);
          await interaction.reply({
            content: '🎟️ Tu as rejoint la séance ! (Erreur lors de l\'attribution du rôle)',
            ephemeral: true
          });
        }
      } else {
        await interaction.reply({ 
          content: 'ℹ️ Tu es déjà dans la liste des participants !', 
          ephemeral: true 
        });
      }
    } catch (error) {
      console.error('Erreur lors de la participation à la séance :', error);
      if (!interaction.replied) {
        await interaction.reply({ 
          content: '❌ Une erreur est survenue lors de la participation à la séance.', 
          ephemeral: true 
        });
      }
    }
  }
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', error => {
  console.error('Erreur non gérée :', error);
});
const token = process.env.DISCORD_TOKEN;
console.log('Token récupéré :', token ? `${token.slice(0, 5)}...${token.slice(-5)}` : 'ABSENT');
client.login(token)

// Connexion du bot
client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log('✅ Connexion au serveur Discord établie'))
  .catch(error => {
    console.error('❌ Erreur de connexion :', error);
    process.exit(1);
  });

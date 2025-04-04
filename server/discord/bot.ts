import { Client, GatewayIntentBits, Events, REST, Routes } from "discord.js";
import { storage } from "../storage";
import { commands } from "./commands";

let client: Client | null = null;

export async function initBot() {
  if (client) {
    // Bot already initialized
    return client;
  }

  const settings = await storage.getBotSettings();
  
  if (!settings || !settings.token || !settings.clientId) {
    throw new Error("Discord bot settings not configured");
  }

  // Create a new client instance
  client = new Client({ 
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
    ]
  });

  // Register commands
  const rest = new REST({ version: '10' }).setToken(settings.token);
  
  try {
    console.log('Started refreshing application (/) commands.');

    const commandsData = commands.map(cmd => cmd.data.toJSON());
    
    if (settings.guildId) {
      // Guild-specific commands (deploy instantly)
      await rest.put(
        Routes.applicationGuildCommands(settings.clientId, settings.guildId),
        { body: commandsData },
      );
      console.log(`Successfully registered application commands for guild ${settings.guildId}`);
    } else {
      // Global commands (can take up to an hour to deploy)
      await rest.put(
        Routes.applicationCommands(settings.clientId),
        { body: commandsData },
      );
      console.log('Successfully registered global application commands');
    }
  } catch (error) {
    console.error('Error registering commands:', error);
  }

  // Set up event handlers
  client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find(cmd => cmd.data.name === interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      
      const errorMessage = 'There was an error while executing this command!';
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  });

  // Login to Discord
  await client.login(settings.token);
  
  return client;
}

export function getClient() {
  return client;
}

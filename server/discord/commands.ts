import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { storage } from "../storage";
import { formatBuildEmbed, formatEquipmentField } from "./utils";

// Command to fetch a specific build by its command alias
const buildCommand = {
  data: new SlashCommandBuilder()
    .setName('build')
    .setDescription('Show an Albion Online build')
    .addStringOption(option => 
      option.setName('name')
        .setDescription('The name or alias of the build')
        .setRequired(true)
        .setAutocomplete(true)),
  
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    
    const buildName = interaction.options.getString('name', true);
    
    try {
      // Try to find by command alias
      let build = await storage.getBuildByCommandAlias(buildName);
      
      // If not found, search in all builds with a partial name match
      if (!build) {
        const allBuilds = await storage.getBuilds();
        build = allBuilds.find(b => 
          b.name.toLowerCase().includes(buildName.toLowerCase()) || 
          b.commandAlias.toLowerCase().includes(buildName.toLowerCase())
        );
      }
      
      if (!build) {
        return interaction.editReply(`No build found with name or alias: ${buildName}`);
      }
      
      const embed = formatBuildEmbed(build);
      
      // Add a link to the web interface
      const actionRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setLabel('View on Website')
            .setStyle(ButtonStyle.Link)
            .setURL(`${process.env.PUBLIC_URL || 'https://bfgbuildmanager.onrender.com'}/builds/${build.id}`)
        );
      
      await interaction.editReply({ embeds: [embed], components: [actionRow] });
    } catch (error) {
      console.error(error);
      await interaction.editReply('Failed to retrieve the build. Please try again later.');
    }
  }
};

// Command to list all available builds or filter by activity type
const buildsCommand = {
  data: new SlashCommandBuilder()
    .setName('builds')
    .setDescription('List available Albion Online builds')
    .addStringOption(option => 
      option.setName('activity')
        .setDescription('Filter builds by activity type')
        .setRequired(false)
        .addChoices(
          { name: 'Solo PvP', value: 'Solo PvP' },
          { name: 'Group PvP', value: 'Group PvP' },
          { name: 'Ganking', value: 'Ganking' },
          { name: 'Gathering', value: 'Gathering' },
          { name: 'Avalon', value: 'Avalon' },
          { name: 'Farming', value: 'Farming' }
        )),
  
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    
    const activityType = interaction.options.getString('activity');
    
    try {
      let builds;
      
      if (activityType) {
        builds = await storage.getBuildsByActivityType(activityType);
      } else {
        builds = await storage.getBuilds();
      }
      
      if (builds.length === 0) {
        return interaction.editReply('No builds found' + (activityType ? ` for activity: ${activityType}` : ''));
      }
      
      // Create embed to list the builds
      const embed = new EmbedBuilder()
        .setTitle(`Albion Online Builds${activityType ? ` for ${activityType}` : ''}`)
        .setColor('#D4AF37')
        .setDescription('Use `/build <name>` to view details of a specific build')
        .setTimestamp();
      
      // Group builds by activity type
      const buildsByActivity = builds.reduce((acc, build) => {
        if (!acc[build.activityType]) {
          acc[build.activityType] = [];
        }
        acc[build.activityType].push(build);
        return acc;
      }, {} as Record<string, typeof builds>);
      
      // Add fields for each activity type
      for (const [activity, activityBuilds] of Object.entries(buildsByActivity)) {
        const buildsList = activityBuilds
          .map(build => `• **${build.name}** *(${build.commandAlias})*${build.isMeta ? ' 🌟' : ''}`)
          .join('\n');
        
        embed.addFields({ name: activity, value: buildsList });
      }
      
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply('Failed to retrieve builds. Please try again later.');
    }
  }
};

// Command to show information about the bot
const helpCommand = {
  data: new SlashCommandBuilder()
    .setName('albion-help')
    .setDescription('Show help information for the Albion Online Bot'),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('Albion Online Bot - Help')
      .setColor('#D4AF37')
      .setDescription('The Albion Online Bot provides equipment builds and recommendations for various activities in Albion Online.')
      .addFields(
        { name: '/build <name>', value: 'Show a specific build by its name or alias' },
        { name: '/builds [activity]', value: 'List all available builds, optionally filtered by activity type' },
        { name: '/albion-help', value: 'Show this help message' }
      )
      .setFooter({ text: 'Managed through the Albion Online Bot web interface' });
    
    await interaction.reply({ embeds: [embed] });
  }
};

export const commands = [
  buildCommand,
  buildsCommand,
  helpCommand
];

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { banUser, unbanUser, banChannel, unbanChannel } from '../utils/banManager.js';
import { CONFIG } from '../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('[Staff] Banear de ganar XP')
  .addSubcommand(subcommand =>
    subcommand
      .setName('user')
      .setDescription('Banear usuario de ganar XP')
      .addUserOption(option =>
        option.setName('usuario')
          .setDescription('Usuario a banear')
          .setRequired(true)
      )
      .addIntegerOption(option =>
        option.setName('horas')
          .setDescription('Duración en horas (dejar vacío para permanente)')
          .setRequired(false)
          .setMinValue(1)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('channel')
      .setDescription('Banear canal de ganar XP')
      .addChannelOption(option =>
        option.setName('canal')
          .setDescription('Canal a banear')
          .setRequired(true)
      )
  );

export async function execute(interaction) {
  if (!interaction.member.roles.cache.has(CONFIG.STAFF_ROLE_ID) && 
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
  }
  
  const subcommand = interaction.options.getSubcommand();
  
  if (subcommand === 'user') {
    const user = interaction.options.getUser('usuario');
    const hours = interaction.options.getInteger('horas');
    const durationMs = hours ? hours * 60 * 60 * 1000 : null;
    
    await banUser(user.id, interaction.guild.id, durationMs);
    
    const durationText = hours ? `durante ${hours} horas` : 'permanentemente';
    await interaction.reply(`✅ ${user} ha sido baneado de ganar XP ${durationText}`);
  }
  else if (subcommand === 'channel') {
    const channel = interaction.options.getChannel('canal');
    
    await banChannel(channel.id, interaction.guild.id);
    
    await interaction.reply(`✅ ${channel} ha sido baneado de ganar XP`);
  }
}

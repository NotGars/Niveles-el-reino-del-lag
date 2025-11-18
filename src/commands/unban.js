import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { unbanUser, unbanChannel } from '../utils/banManager.js';
import { CONFIG } from '../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('unban')
  .setDescription('[Staff] Desbanear de ganar XP')
  .addSubcommand(subcommand =>
    subcommand
      .setName('user')
      .setDescription('Desbanear usuario')
      .addUserOption(option =>
        option.setName('usuario')
          .setDescription('Usuario a desbanear')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('channel')
      .setDescription('Desbanear canal')
      .addChannelOption(option =>
        option.setName('canal')
          .setDescription('Canal a desbanear')
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
    await unbanUser(user.id, interaction.guild.id);
    await interaction.reply(`✅ ${user} ha sido desbaneado y puede ganar XP nuevamente`);
  }
  else if (subcommand === 'channel') {
    const channel = interaction.options.getChannel('canal');
    await unbanChannel(channel.id, interaction.guild.id);
    await interaction.reply(`✅ ${channel} ha sido desbaneado y se puede ganar XP nuevamente`);
  }
}

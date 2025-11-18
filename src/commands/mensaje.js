import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { CONFIG } from '../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('mensaje')
  .setDescription('[Staff] Enviar un mensaje plano')
  .addStringOption(option =>
    option.setName('texto')
      .setDescription('Texto del mensaje')
      .setRequired(true)
  );

export async function execute(interaction) {
  if (!interaction.member.roles.cache.has(CONFIG.STAFF_ROLE_ID) && 
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
  }
  
  const text = interaction.options.getString('texto');
  
  await interaction.reply(text);
}

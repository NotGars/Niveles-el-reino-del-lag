import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { setLevel } from '../utils/xpManager.js';
import { CONFIG } from '../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('setlevel')
  .setDescription('[Staff] Establecer el nivel de un usuario')
  .addUserOption(option =>
    option.setName('usuario')
      .setDescription('Usuario al que establecer nivel')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('nivel')
      .setDescription('Nuevo nivel')
      .setRequired(true)
      .setMinValue(0)
  );

export async function execute(interaction) {
  if (!interaction.member.roles.cache.has(CONFIG.STAFF_ROLE_ID) && 
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
  }
  
  const targetUser = interaction.options.getUser('usuario');
  const newLevel = interaction.options.getInteger('nivel');
  
  await setLevel(targetUser.id, interaction.guild.id, newLevel);
  
  await interaction.reply(`✅ El nivel de ${targetUser} ha sido establecido a **${newLevel}**`);
}

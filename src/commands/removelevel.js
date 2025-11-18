import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getUser, setLevel } from '../utils/xpManager.js';
import { CONFIG } from '../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('removelevel')
  .setDescription('[Staff] Quitar niveles a un usuario')
  .addUserOption(option =>
    option.setName('usuario')
      .setDescription('Usuario al que quitar niveles')
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option.setName('cantidad')
      .setDescription('Cantidad de niveles a quitar')
      .setRequired(true)
      .setMinValue(1)
  );

export async function execute(interaction) {
  if (!interaction.member.roles.cache.has(CONFIG.STAFF_ROLE_ID) && 
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
  }
  
  const targetUser = interaction.options.getUser('usuario');
  const amount = interaction.options.getInteger('cantidad');
  
  const userData = await getUser(targetUser.id, interaction.guild.id);
  const newLevel = Math.max(0, parseInt(userData.level) - amount);
  
  await setLevel(targetUser.id, interaction.guild.id, newLevel);
  
  await interaction.reply(`✅ Se han quitado **${amount}** niveles a ${targetUser}. Nuevo nivel: **${newLevel}**`);
}

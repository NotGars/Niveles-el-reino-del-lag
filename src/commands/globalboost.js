import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { addBoost, removeBoost } from '../utils/xpManager.js';
import { CONFIG } from '../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('globalboost')
  .setDescription('[Staff] Gestionar boost global del servidor')
  .addSubcommand(subcommand =>
    subcommand
      .setName('add')
      .setDescription('Añadir boost global al servidor')
      .addIntegerOption(option =>
        option.setName('porcentaje')
          .setDescription('Porcentaje de boost')
          .setRequired(true)
          .setMinValue(1)
      )
      .addIntegerOption(option =>
        option.setName('duracion')
          .setDescription('Duración en minutos (dejar vacío para permanente)')
          .setRequired(false)
          .setMinValue(1)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('remove')
      .setDescription('Quitar boost global del servidor')
  );

export async function execute(interaction) {
  if (!interaction.member.roles.cache.has(CONFIG.STAFF_ROLE_ID) && 
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
  }
  
  const subcommand = interaction.options.getSubcommand();
  
  if (subcommand === 'add') {
    const percent = interaction.options.getInteger('porcentaje');
    const duration = interaction.options.getInteger('duracion');
    const durationMs = duration ? duration * 60 * 1000 : null;
    
    await addBoost('global', 'server', interaction.guild.id, percent, durationMs);
    
    const durationText = duration ? `durante ${duration} minutos` : 'permanente';
    await interaction.reply(`✅ Boost global de **${percent}%** activado ${durationText} para todo el servidor!`);
  } else {
    await removeBoost('global', 'server', interaction.guild.id);
    await interaction.reply('✅ Boost global del servidor removido.');
  }
}

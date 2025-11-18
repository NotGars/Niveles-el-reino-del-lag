import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { CONFIG } from '../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('rewards')
  .setDescription('Comandos de recompensas')
  .addSubcommand(subcommand =>
    subcommand
      .setName('list')
      .setDescription('Muestra las recompensas por subir de nivel')
  );

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('🎁 Recompensas por Nivel')
    .setDescription('Estos son los roles que obtendrás al alcanzar ciertos niveles:')
    .addFields(
      { name: '📊 Nivel 1', value: `<@&${CONFIG.LEVEL_REWARDS[1]}>`, inline: true },
      { name: '📊 Nivel 5', value: `<@&${CONFIG.LEVEL_REWARDS[5]}>`, inline: true },
      { name: '📊 Nivel 10', value: `<@&${CONFIG.LEVEL_REWARDS[10]}>`, inline: true },
      { name: '📊 Nivel 20', value: `<@&${CONFIG.LEVEL_REWARDS[20]}>`, inline: true },
      { name: '⭐ Nivel 25', value: `<@&${CONFIG.LEVEL_REWARDS[25]}> (Miembro Activo)`, inline: true },
      { name: '📊 Nivel 30', value: `<@&${CONFIG.LEVEL_REWARDS[30]}>`, inline: true },
      { name: '🌟 Nivel 35', value: `<@&${CONFIG.LEVEL_REWARDS[35]}> (Super Activo)`, inline: true },
      { name: '📊 Nivel 40', value: `<@&${CONFIG.LEVEL_REWARDS[40]}>`, inline: true },
      { name: '📊 Nivel 50', value: `<@&${CONFIG.LEVEL_REWARDS[50]}>`, inline: true },
      { name: '💫 Nivel 75', value: `<@&${CONFIG.LEVEL_REWARDS[75]}>`, inline: true },
      { name: '👑 Nivel 100', value: `<@&${CONFIG.LEVEL_REWARDS[100]}>`, inline: true }
    )
    .setFooter({ text: '¡Sigue chateando para ganar XP y subir de nivel!' })
    .setTimestamp();
  
  await interaction.reply({ embeds: [embed] });
}

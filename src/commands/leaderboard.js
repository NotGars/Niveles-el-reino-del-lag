import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { getLeaderboard } from '../utils/xpManager.js';
import { generateLeaderboard } from '../utils/cardGenerator.js';

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('Muestra la tabla de clasificación del servidor');

export async function execute(interaction) {
  await interaction.deferReply();
  
  const topUsers = await getLeaderboard(interaction.guild.id, 10);
  
  if (topUsers.length === 0) {
    return interaction.editReply('⚠️ Aún no hay usuarios en el leaderboard.');
  }
  
  const leaderboardBuffer = await generateLeaderboard(interaction.guild, topUsers);
  const attachment = new AttachmentBuilder(leaderboardBuffer, { name: 'leaderboard.png' });
  
  await interaction.editReply({ files: [attachment] });
}

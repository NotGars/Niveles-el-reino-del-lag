import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { getUser, getLeaderboard } from '../utils/xpManager.js';
import { generateLevelCard } from '../utils/cardGenerator.js';

export const data = new SlashCommandBuilder()
  .setName('level')
  .setDescription('Muestra el nivel de un usuario')
  .addUserOption(option =>
    option.setName('usuario')
      .setDescription('Usuario a consultar')
      .setRequired(false)
  );

export async function execute(interaction) {
  await interaction.deferReply();
  
  const targetUser = interaction.options.getUser('usuario') || interaction.user;
  const member = await interaction.guild.members.fetch(targetUser.id);
  
  const userData = await getUser(targetUser.id, interaction.guild.id);
  const leaderboard = await getLeaderboard(interaction.guild.id, 100);
  const rank = leaderboard.findIndex(u => u.user_id === targetUser.id) + 1;
  
  const cardBuffer = await generateLevelCard(
    targetUser,
    member,
    parseInt(userData.level),
    parseInt(userData.xp),
    rank || '?'
  );
  
  const attachment = new AttachmentBuilder(cardBuffer, { name: 'level-card.png' });
  
  await interaction.editReply({ files: [attachment] });
}

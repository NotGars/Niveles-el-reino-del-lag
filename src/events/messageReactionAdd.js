import { addXP } from '../utils/xpManager.js';
import { isUserBanned, isChannelBanned } from '../utils/banManager.js';
import { CONFIG } from '../config/constants.js';

export async function handleReaction(reaction, user) {
  if (user.bot) return;
  if (!reaction.message.guild) return;
  
  if (CONFIG.NO_XP_CHANNELS.includes(reaction.message.channel.id)) return;
  
  const userBanned = await isUserBanned(user.id, reaction.message.guild.id);
  if (userBanned) return;
  
  const channelBanned = await isChannelBanned(reaction.message.channel.id, reaction.message.guild.id);
  if (channelBanned) return;
  
  await addXP(user.id, reaction.message.guild.id, 5);
}

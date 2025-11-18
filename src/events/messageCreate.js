import { AttachmentBuilder } from 'discord.js';
import { addXP, getUser, getTotalBoostMultiplier } from '../utils/xpManager.js';
import { isUserBanned, isChannelBanned } from '../utils/banManager.js';
import { CONFIG, calculateXPRequired } from '../config/constants.js';
import { generateLevelCard } from '../utils/cardGenerator.js';

export async function handleMessage(message) {
  if (message.author.bot) return;
  if (!message.guild) return;
  
  if (CONFIG.NO_XP_CHANNELS.includes(message.channel.id)) return;
  
  const userBanned = await isUserBanned(message.author.id, message.guild.id);
  if (userBanned) return;
  
  const channelBanned = await isChannelBanned(message.channel.id, message.guild.id);
  if (channelBanned) return;
  
  const member = message.member;
  let baseXP = 15;
  
  if (message.attachments.size > 0) {
    baseXP += 10;
  }
  
  let roleBoost = 0;
  if (member.roles.cache.has(CONFIG.BOOSTER_ROLE_ID)) {
    roleBoost += CONFIG.BOOSTER_VIP_BOOST;
  }
  if (member.roles.cache.has(CONFIG.VIP_ROLE_ID)) {
    roleBoost += CONFIG.BOOSTER_VIP_BOOST;
  }
  
  const channelBoost = await getTotalBoostMultiplier(message.author.id, message.guild.id, message.channel.id);
  
  const result = await addXP(message.author.id, message.guild.id, baseXP);
  
  if (!result) return;
  
  if (result.leveledUp) {
    const newLevel = result.level;
    
    if (CONFIG.LEVEL_REWARDS[newLevel]) {
      const roleId = CONFIG.LEVEL_REWARDS[newLevel];
      try {
        const role = message.guild.roles.cache.get(roleId);
        if (role && !member.roles.cache.has(roleId)) {
          await member.roles.add(role);
        }
      } catch (error) {
        console.error(`Error añadiendo rol de nivel ${newLevel}:`, error);
      }
    }
    
    try {
      const levelUpChannel = message.guild.channels.cache.get(CONFIG.LEVEL_UP_CHANNEL);
      if (levelUpChannel) {
        const userData = await getUser(message.author.id, message.guild.id);
        const cardBuffer = await generateLevelCard(
          message.author,
          member,
          newLevel,
          parseInt(userData.xp),
          '?'
        );
        
        const attachment = new AttachmentBuilder(cardBuffer, { name: 'level-up.png' });
        
        await levelUpChannel.send({
          content: `🎉 ${message.author} ha subido al **Nivel ${newLevel}**! GG! 🎉`,
          files: [attachment]
        });
      }
    } catch (error) {
      console.error('Error enviando mensaje de level up:', error);
    }
  }
}

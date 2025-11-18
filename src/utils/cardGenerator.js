import { createCanvas, loadImage, registerFont } from 'canvas';
import { calculateXPRequired } from '../config/constants.js';

export async function generateLevelCard(user, member, level, xp, rank) {
  const canvas = createCanvas(800, 250);
  const ctx = canvas.getContext('2d');
  
  const cardStyle = getCardStyle(member, level);
  
  ctx.fillStyle = cardStyle.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  drawPixelArtBackground(ctx, cardStyle);
  
  ctx.strokeStyle = cardStyle.borderColor;
  ctx.lineWidth = 5;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  
  try {
    const avatarURL = user.displayAvatarURL({ extension: 'png', size: 128 });
    const avatar = await loadImage(avatarURL);
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(100, 125, 60, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 40, 65, 120, 120);
    ctx.restore();
    
    ctx.strokeStyle = cardStyle.accentColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(100, 125, 62, 0, Math.PI * 2);
    ctx.stroke();
  } catch (error) {
    console.error('Error cargando avatar:', error);
  }
  
  ctx.fillStyle = cardStyle.textColor;
  ctx.font = 'bold 32px Arial';
  ctx.fillText(user.username, 180, 70);
  
  ctx.font = '24px Arial';
  ctx.fillStyle = cardStyle.accentColor;
  ctx.fillText(`Nivel: ${level}`, 180, 110);
  
  ctx.fillText(`Rango: #${rank}`, 180, 145);
  
  const xpRequired = calculateXPRequired(level + 1);
  const progress = xp / xpRequired;
  
  const barX = 180;
  const barY = 170;
  const barWidth = 580;
  const barHeight = 35;
  
  ctx.fillStyle = '#2C2F33';
  ctx.fillRect(barX, barY, barWidth, barHeight);
  
  const gradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
  gradient.addColorStop(0, cardStyle.progressStart);
  gradient.addColorStop(1, cardStyle.progressEnd);
  ctx.fillStyle = gradient;
  ctx.fillRect(barX, barY, barWidth * progress, barHeight);
  
  ctx.strokeStyle = cardStyle.accentColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(barX, barY, barWidth, barHeight);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${xp} / ${xpRequired} XP`, barX + barWidth / 2, barY + 23);
  
  ctx.textAlign = 'left';
  
  return canvas.toBuffer('image/png');
}

function getCardStyle(member, level) {
  const hasRole = (roleId) => member.roles.cache.has(roleId);
  const userId = member.user.id;
  
  if (userId === '956700088103747625') {
    const styles = [
      {
        name: 'Roblox',
        backgroundColor: '#E31937',
        borderColor: '#FFFFFF',
        accentColor: '#FFD700',
        textColor: '#FFFFFF',
        progressStart: '#00A2FF',
        progressEnd: '#0055FF',
        pattern: 'roblox'
      },
      {
        name: 'Minecraft',
        backgroundColor: '#3C8527',
        borderColor: '#8B4513',
        accentColor: '#FFD700',
        textColor: '#FFFFFF',
        progressStart: '#00AA00',
        progressEnd: '#00FF00',
        pattern: 'minecraft'
      },
      {
        name: 'Zelda',
        backgroundColor: '#2E7D32',
        borderColor: '#FFD700',
        accentColor: '#FFEB3B',
        textColor: '#FFFFFF',
        progressStart: '#81C784',
        progressEnd: '#4CAF50',
        pattern: 'zelda'
      },
      {
        name: 'FNAF',
        backgroundColor: '#1A0F0F',
        borderColor: '#8B0000',
        accentColor: '#FF4444',
        textColor: '#FFFFFF',
        progressStart: '#4A0000',
        progressEnd: '#8B0000',
        pattern: 'fnaf'
      },
      {
        name: 'Geometry Dash',
        backgroundColor: '#0A0A2E',
        borderColor: '#00FFFF',
        accentColor: '#00FF00',
        textColor: '#FFFFFF',
        progressStart: '#FF00FF',
        progressEnd: '#00FFFF',
        pattern: 'geometrydash'
      }
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }
  
  if (hasRole('1423037247606882399')) {
    return {
      name: 'Geometry Dash (Booster)',
      backgroundColor: '#0A0A2E',
      borderColor: '#00FFFF',
      accentColor: '#FF00FF',
      textColor: '#FFFFFF',
      progressStart: '#FF00FF',
      progressEnd: '#00FFFF',
      pattern: 'geometrydash'
    };
  }
  
  if (hasRole('1423037247606882399')) {
    return {
      name: 'VIP Nocturno',
      backgroundColor: '#0D1B2A',
      borderColor: '#FFD700',
      accentColor: '#F1C40F',
      textColor: '#E8E8E8',
      progressStart: '#3498DB',
      progressEnd: '#9B59B6',
      pattern: 'night'
    };
  }
  
  if (level >= 100) {
    return {
      name: 'Pokemon Master',
      backgroundColor: '#CC0000',
      borderColor: '#FFCB05',
      accentColor: '#FFCB05',
      textColor: '#FFFFFF',
      progressStart: '#3B4CCA',
      progressEnd: '#FFDE00',
      pattern: 'pokemon'
    };
  }
  
  if (level >= 35 || hasRole('1313716401021911102')) {
    return {
      name: 'Super Activo (Zelda)',
      backgroundColor: '#2E7D32',
      borderColor: '#FFD700',
      accentColor: '#FFEB3B',
      textColor: '#FFFFFF',
      progressStart: '#81C784',
      progressEnd: '#4CAF50',
      pattern: 'zelda'
    };
  }
  
  if (level >= 25 || hasRole('1239330751334584421')) {
    return {
      name: 'Activo (Mar)',
      backgroundColor: '#006994',
      borderColor: '#00D9FF',
      accentColor: '#4DD0E1',
      textColor: '#FFFFFF',
      progressStart: '#00796B',
      progressEnd: '#00BCD4',
      pattern: 'ocean'
    };
  }
  
  return {
    name: 'Normal (Pixel Art)',
    backgroundColor: '#23272A',
    borderColor: '#7289DA',
    accentColor: '#43B581',
    textColor: '#FFFFFF',
    progressStart: '#7289DA',
    progressEnd: '#43B581',
    pattern: 'pixel'
  };
}

function drawPixelArtBackground(ctx, style) {
  const patternSize = 20;
  
  switch (style.pattern) {
    case 'ocean':
      for (let i = 0; i < 800; i += patternSize) {
        for (let j = 0; j < 250; j += patternSize) {
          if (Math.random() > 0.7) {
            ctx.fillStyle = 'rgba(0, 188, 212, 0.1)';
            ctx.fillRect(i, j, patternSize, patternSize);
          }
        }
      }
      break;
      
    case 'zelda':
      for (let i = 0; i < 800; i += patternSize * 2) {
        for (let j = 0; j < 250; j += patternSize * 2) {
          ctx.fillStyle = 'rgba(255, 235, 59, 0.05)';
          ctx.fillRect(i, j, patternSize, patternSize);
        }
      }
      break;
      
    case 'pokemon':
      for (let i = 0; i < 800; i += patternSize * 3) {
        ctx.fillStyle = 'rgba(255, 203, 5, 0.1)';
        ctx.fillRect(i, 0, 3, 250);
      }
      break;
      
    case 'geometrydash':
      for (let i = 0; i < 800; i += patternSize) {
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.05)`;
        ctx.fillRect(i, 0, 2, 250);
      }
      break;
      
    case 'night':
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 250;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, y, 2, 2);
      }
      break;
      
    default:
      for (let i = 0; i < 800; i += patternSize) {
        for (let j = 0; j < 250; j += patternSize) {
          if ((i / patternSize + j / patternSize) % 2 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.fillRect(i, j, patternSize, patternSize);
          }
        }
      }
  }
}

export async function generateLeaderboard(guild, topUsers) {
  const canvas = createCanvas(700, 1100);
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#0f0f1e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🏆 LEADERBOARD 🏆', canvas.width / 2, 60);
  
  ctx.font = '18px Arial';
  ctx.fillStyle = '#888888';
  ctx.fillText('Top 10 Usuarios', canvas.width / 2, 90);
  
  let yPosition = 130;
  
  for (let i = 0; i < topUsers.length && i < 10; i++) {
    const userData = topUsers[i];
    const rank = i + 1;
    const level = parseInt(userData.level);
    const currentXP = parseInt(userData.xp);
    const xpRequired = calculateXPRequired(level + 1);
    const progress = Math.min(currentXP / xpRequired, 1);
    
    let bgColor, textColor, rankColor, progressColor;
    
    if (rank === 1) {
      bgColor = '#FFD700';
      textColor = '#000000';
      rankColor = '#FFB700';
      progressColor = '#FFA500';
    } else if (rank === 2) {
      bgColor = '#C0C0C0';
      textColor = '#000000';
      rankColor = '#A8A8A8';
      progressColor = '#909090';
    } else if (rank === 3) {
      bgColor = '#CD7F32';
      textColor = '#FFFFFF';
      rankColor = '#B8682F';
      progressColor = '#A0522D';
    } else {
      bgColor = '#2C2F33';
      textColor = '#FFFFFF';
      rankColor = '#7289DA';
      progressColor = '#5865F2';
    }
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(50, yPosition, 600, 95);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(50, yPosition, 600, 3);
    ctx.fillRect(50, yPosition + 92, 600, 3);
    
    ctx.fillStyle = rankColor;
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`#${rank}`, 70, yPosition + 38);
    
    try {
      const member = await guild.members.fetch(userData.user_id);
      const avatarURL = member.user.displayAvatarURL({ extension: 'png', size: 128 });
      const avatar = await loadImage(avatarURL);
      
      ctx.save();
      ctx.beginPath();
      ctx.arc(165, yPosition + 35, 30, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 135, yPosition + 5, 60, 60);
      ctx.restore();
      
      ctx.strokeStyle = rank <= 3 ? rankColor : '#444444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(165, yPosition + 35, 32, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = textColor;
      ctx.font = 'bold 24px Arial';
      const username = member.user.username.length > 18 ? 
        member.user.username.substring(0, 15) + '...' : 
        member.user.username;
      ctx.fillText(username, 215, yPosition + 30);
    } catch (error) {
      ctx.fillStyle = textColor;
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Usuario', 215, yPosition + 30);
    }
    
    ctx.fillStyle = textColor;
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`LVL: ${level}`, 620, yPosition + 30);
    
    const barX = 215;
    const barY = yPosition + 45;
    const barWidth = 405;
    const barHeight = 28;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    const progressGradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
    if (rank === 1) {
      progressGradient.addColorStop(0, '#FFD700');
      progressGradient.addColorStop(1, '#FFA500');
    } else if (rank === 2) {
      progressGradient.addColorStop(0, '#E8E8E8');
      progressGradient.addColorStop(1, '#A0A0A0');
    } else if (rank === 3) {
      progressGradient.addColorStop(0, '#D4A574');
      progressGradient.addColorStop(1, '#A0522D');
    } else {
      progressGradient.addColorStop(0, '#7289DA');
      progressGradient.addColorStop(1, '#5865F2');
    }
    
    ctx.fillStyle = progressGradient;
    ctx.fillRect(barX, barY, barWidth * progress, barHeight);
    
    ctx.strokeStyle = rank <= 3 ? progressColor : '#5865F2';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${currentXP.toLocaleString()} / ${xpRequired.toLocaleString()} XP`, barX + barWidth / 2, barY + 19);
    
    ctx.textAlign = 'left';
    
    yPosition += 105;
  }
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('¡Sigue chateando para subir en el ranking!', canvas.width / 2, canvas.height - 20);
  
  return canvas.toBuffer('image/png');
}

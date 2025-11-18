import { pool } from '../database/setup.js';
import { CONFIG, calculateXPRequired } from '../config/constants.js';

export async function getUser(userId, guildId) {
  const result = await pool.query(
    'SELECT * FROM users WHERE user_id = $1 AND guild_id = $2',
    [userId, guildId]
  );
  
  if (result.rows.length === 0) {
    const insertResult = await pool.query(
      'INSERT INTO users (user_id, guild_id, xp, level, total_xp) VALUES ($1, $2, 0, 0, 0) RETURNING *',
      [userId, guildId]
    );
    return insertResult.rows[0];
  }
  
  return result.rows[0];
}

export async function addXP(userId, guildId, baseAmount = 15) {
  const now = Date.now();
  const user = await getUser(userId, guildId);
  
  if (now - user.last_xp_time < CONFIG.XP_COOLDOWN) {
    return null;
  }
  
  const boostMultiplier = await getTotalBoostMultiplier(userId, guildId);
  const xpToAdd = Math.floor(baseAmount * (1 + boostMultiplier / 100));
  
  const newXP = parseInt(user.xp) + xpToAdd;
  const newTotalXP = parseInt(user.total_xp) + xpToAdd;
  let currentLevel = parseInt(user.level);
  let leveledUp = false;
  let oldLevel = currentLevel;
  
  let tempXP = newXP;
  while (tempXP >= calculateXPRequired(currentLevel + 1)) {
    tempXP -= calculateXPRequired(currentLevel + 1);
    currentLevel++;
    leveledUp = true;
  }
  
  await pool.query(
    'UPDATE users SET xp = $1, level = $2, total_xp = $3, last_xp_time = $4 WHERE user_id = $5 AND guild_id = $6',
    [tempXP, currentLevel, newTotalXP, now, userId, guildId]
  );
  
  return {
    xpGained: xpToAdd,
    currentXP: tempXP,
    level: currentLevel,
    leveledUp,
    oldLevel,
    boostMultiplier
  };
}

export async function getTotalBoostMultiplier(userId, guildId, channelId = null) {
  const now = Date.now();
  let totalBoost = 0;
  
  await pool.query('DELETE FROM boosts WHERE expires_at IS NOT NULL AND expires_at < $1', [now]);
  
  const userBoosts = await pool.query(
    'SELECT boost_percent FROM boosts WHERE type = $1 AND target_id = $2 AND guild_id = $3 AND (expires_at IS NULL OR expires_at > $4)',
    ['user', userId, guildId, now]
  );
  userBoosts.rows.forEach(row => {
    totalBoost += parseInt(row.boost_percent);
  });
  
  if (channelId) {
    const channelBoosts = await pool.query(
      'SELECT boost_percent FROM boosts WHERE type = $1 AND target_id = $2 AND guild_id = $3 AND (expires_at IS NULL OR expires_at > $4)',
      ['channel', channelId, guildId, now]
    );
    channelBoosts.rows.forEach(row => {
      totalBoost += parseInt(row.boost_percent);
    });
  }
  
  const globalBoosts = await pool.query(
    'SELECT boost_percent FROM boosts WHERE type = $1 AND guild_id = $2 AND (expires_at IS NULL OR expires_at > $3)',
    ['global', guildId, now]
  );
  globalBoosts.rows.forEach(row => {
    totalBoost += parseInt(row.boost_percent);
  });
  
  return totalBoost;
}

export async function addBoost(type, targetId, guildId, boostPercent, durationMs = null) {
  const expiresAt = durationMs ? Date.now() + durationMs : null;
  
  await pool.query(
    'INSERT INTO boosts (type, target_id, guild_id, boost_percent, duration, expires_at) VALUES ($1, $2, $3, $4, $5, $6)',
    [type, targetId, guildId, boostPercent, durationMs, expiresAt]
  );
}

export async function removeBoost(type, targetId, guildId) {
  await pool.query(
    'DELETE FROM boosts WHERE type = $1 AND target_id = $2 AND guild_id = $3',
    [type, targetId, guildId]
  );
}

export async function getLeaderboard(guildId, limit = 10) {
  const result = await pool.query(
    'SELECT user_id, xp, level, total_xp FROM users WHERE guild_id = $1 ORDER BY level DESC, xp DESC LIMIT $2',
    [guildId, limit]
  );
  
  return result.rows;
}

export async function setLevel(userId, guildId, newLevel) {
  const xpForLevel = 0;
  
  await pool.query(
    'UPDATE users SET level = $1, xp = $2 WHERE user_id = $3 AND guild_id = $4',
    [newLevel, xpForLevel, userId, guildId]
  );
}

export async function setXP(userId, guildId, newXP) {
  const user = await getUser(userId, guildId);
  const newTotalXP = parseInt(user.total_xp) + newXP;
  
  await pool.query(
    'UPDATE users SET xp = xp + $1, total_xp = $2 WHERE user_id = $3 AND guild_id = $4',
    [newXP, newTotalXP, userId, guildId]
  );
}

export async function resetUser(userId, guildId) {
  await pool.query(
    'UPDATE users SET xp = 0, level = 0, total_xp = 0 WHERE user_id = $1 AND guild_id = $2',
    [userId, guildId]
  );
}

export async function resetAllUsers(guildId) {
  await pool.query(
    'UPDATE users SET xp = 0, level = 0, total_xp = 0 WHERE guild_id = $1',
    [guildId]
  );
}

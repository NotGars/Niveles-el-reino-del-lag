import { pool } from '../database/setup.js';

export async function setCooldown(userId, guildId, gameType, durationMs) {
  const expiresAt = Date.now() + durationMs;
  
  await pool.query(
    'DELETE FROM cooldowns WHERE user_id = $1 AND guild_id = $2 AND game_type = $3',
    [userId, guildId, gameType]
  );
  
  await pool.query(
    'INSERT INTO cooldowns (user_id, guild_id, game_type, expires_at) VALUES ($1, $2, $3, $4)',
    [userId, guildId, gameType, expiresAt]
  );
}

export async function getCooldown(userId, guildId, gameType) {
  const now = Date.now();
  
  await pool.query('DELETE FROM cooldowns WHERE expires_at < $1', [now]);
  
  const result = await pool.query(
    'SELECT expires_at FROM cooldowns WHERE user_id = $1 AND guild_id = $2 AND game_type = $3',
    [userId, guildId, gameType]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const expiresAt = parseInt(result.rows[0].expires_at);
  const remaining = expiresAt - now;
  
  return remaining > 0 ? remaining : null;
}

export async function clearCooldown(userId, guildId, gameType) {
  await pool.query(
    'DELETE FROM cooldowns WHERE user_id = $1 AND guild_id = $2 AND game_type = $3',
    [userId, guildId, gameType]
  );
}

export function formatTimeRemaining(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

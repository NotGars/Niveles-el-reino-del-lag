import { pool } from '../database/setup.js';

export async function banUser(userId, guildId, durationMs = null) {
  const expiresAt = durationMs ? Date.now() + durationMs : null;
  
  await pool.query(
    'DELETE FROM bans WHERE type = $1 AND target_id = $2 AND guild_id = $3',
    ['user', userId, guildId]
  );
  
  await pool.query(
    'INSERT INTO bans (type, target_id, guild_id, expires_at) VALUES ($1, $2, $3, $4)',
    ['user', userId, guildId, expiresAt]
  );
}

export async function unbanUser(userId, guildId) {
  await pool.query(
    'DELETE FROM bans WHERE type = $1 AND target_id = $2 AND guild_id = $3',
    ['user', userId, guildId]
  );
}

export async function banChannel(channelId, guildId) {
  await pool.query(
    'DELETE FROM bans WHERE type = $1 AND target_id = $2 AND guild_id = $3',
    ['channel', channelId, guildId]
  );
  
  await pool.query(
    'INSERT INTO bans (type, target_id, guild_id) VALUES ($1, $2, $3)',
    ['channel', channelId, guildId]
  );
}

export async function unbanChannel(channelId, guildId) {
  await pool.query(
    'DELETE FROM bans WHERE type = $1 AND target_id = $2 AND guild_id = $3',
    ['channel', channelId, guildId]
  );
}

export async function isUserBanned(userId, guildId) {
  const now = Date.now();
  
  await pool.query(
    'DELETE FROM bans WHERE type = $1 AND expires_at IS NOT NULL AND expires_at < $2',
    ['user', now]
  );
  
  const result = await pool.query(
    'SELECT * FROM bans WHERE type = $1 AND target_id = $2 AND guild_id = $3 AND (expires_at IS NULL OR expires_at > $4)',
    ['user', userId, guildId, now]
  );
  
  return result.rows.length > 0;
}

export async function isChannelBanned(channelId, guildId) {
  const result = await pool.query(
    'SELECT * FROM bans WHERE type = $1 AND target_id = $2 AND guild_id = $3',
    ['channel', channelId, guildId]
  );
  
  return result.rows.length > 0;
}

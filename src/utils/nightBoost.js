import cron from 'node-cron';
import moment from 'moment-timezone';
import { pool } from '../database/setup.js';
import { CONFIG } from '../config/constants.js';

export function startNightBoostScheduler(client) {
  cron.schedule('*/15 * * * *', async () => {
    try {
      const now = moment().tz('America/Caracas');
      const hour = now.hour();
      
      const isNight = hour >= 20 || hour < 6;
      
      const guilds = client.guilds.cache;
      
      for (const [guildId, guild] of guilds) {
        const existingBoost = await pool.query(
          'SELECT * FROM boosts WHERE type = $1 AND target_id = $2 AND guild_id = $3',
          ['global', 'night_boost', guildId]
        );
        
        if (isNight && existingBoost.rows.length === 0) {
          await pool.query(
            'INSERT INTO boosts (type, target_id, guild_id, boost_percent) VALUES ($1, $2, $3, $4)',
            ['global', 'night_boost', guildId, CONFIG.NIGHT_BOOST_PERCENT]
          );
          console.log(`🌙 Boost nocturno activado en ${guild.name}`);
        }
        
        else if (!isNight && existingBoost.rows.length > 0) {
          await pool.query(
            'DELETE FROM boosts WHERE type = $1 AND target_id = $2 AND guild_id = $3',
            ['global', 'night_boost', guildId]
          );
          console.log(`☀️ Boost nocturno desactivado en ${guild.name}`);
        }
      }
    } catch (error) {
      console.error('Error en night boost scheduler:', error);
    }
  });
  
  console.log('🌙 Night boost scheduler iniciado (horario Venezuela)');
}

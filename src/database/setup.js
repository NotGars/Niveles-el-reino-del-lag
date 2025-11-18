import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function initDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(20) PRIMARY KEY,
        guild_id VARCHAR(20) NOT NULL,
        xp BIGINT DEFAULT 0,
        level INTEGER DEFAULT 0,
        total_xp BIGINT DEFAULT 0,
        last_xp_time BIGINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS boosts (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL,
        target_id VARCHAR(20) NOT NULL,
        guild_id VARCHAR(20) NOT NULL,
        boost_percent INTEGER NOT NULL,
        duration BIGINT,
        expires_at BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS cooldowns (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(20) NOT NULL,
        guild_id VARCHAR(20) NOT NULL,
        game_type VARCHAR(50) NOT NULL,
        expires_at BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS bans (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL,
        target_id VARCHAR(20) NOT NULL,
        guild_id VARCHAR(20) NOT NULL,
        expires_at BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id SERIAL PRIMARY KEY,
        game_type VARCHAR(50) NOT NULL,
        players TEXT[] NOT NULL,
        state JSONB NOT NULL,
        guild_id VARCHAR(20) NOT NULL,
        channel_id VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_guild ON users(guild_id);
      CREATE INDEX IF NOT EXISTS idx_users_level ON users(level DESC);
      CREATE INDEX IF NOT EXISTS idx_boosts_target ON boosts(target_id, guild_id);
      CREATE INDEX IF NOT EXISTS idx_cooldowns_user ON cooldowns(user_id, game_type);
      CREATE INDEX IF NOT EXISTS idx_bans_target ON bans(target_id, guild_id);
    `);
    
    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  } finally {
    client.release();
  }
}

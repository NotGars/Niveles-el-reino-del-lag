import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { addBoost, getTotalBoostMultiplier } from '../utils/xpManager.js';
import { pool } from '../database/setup.js';
import { CONFIG } from '../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('boost')
  .setDescription('Gestionar boosts de XP')
  .addSubcommand(subcommand =>
    subcommand
      .setName('add')
      .setDescription('[Staff] Añadir boost a usuario o canal')
      .addStringOption(option =>
        option.setName('tipo')
          .setDescription('Tipo de boost')
          .setRequired(true)
          .addChoices(
            { name: 'Usuario', value: 'user' },
            { name: 'Canal', value: 'channel' }
          )
      )
      .addIntegerOption(option =>
        option.setName('porcentaje')
          .setDescription('Porcentaje de boost')
          .setRequired(true)
          .setMinValue(1)
      )
      .addIntegerOption(option =>
        option.setName('duracion')
          .setDescription('Duración en horas (dejar vacío para permanente)')
          .setRequired(false)
          .setMinValue(1)
      )
      .addUserOption(option =>
        option.setName('usuario')
          .setDescription('Usuario (si tipo = Usuario)')
          .setRequired(false)
      )
      .addChannelOption(option =>
        option.setName('canal')
          .setDescription('Canal (si tipo = Canal)')
          .setRequired(false)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('list')
      .setDescription('Ver lista de boosts activos')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('status')
      .setDescription('Ver estado de tus boosts activos')
  );

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();
  
  if (subcommand === 'add') {
    if (!interaction.member.roles.cache.has(CONFIG.STAFF_ROLE_ID) && 
        !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
    }
    
    const type = interaction.options.getString('tipo');
    const percent = interaction.options.getInteger('porcentaje');
    const duration = interaction.options.getInteger('duracion');
    
    let targetId;
    if (type === 'user') {
      const user = interaction.options.getUser('usuario');
      if (!user) return interaction.reply({ content: '❌ Debes especificar un usuario.', ephemeral: true });
      targetId = user.id;
    } else {
      const channel = interaction.options.getChannel('canal');
      if (!channel) return interaction.reply({ content: '❌ Debes especificar un canal.', ephemeral: true });
      targetId = channel.id;
    }
    
    const durationMs = duration ? duration * 60 * 60 * 1000 : null;
    await addBoost(type, targetId, interaction.guild.id, percent, durationMs);
    
    const durationText = duration ? `durante ${duration} horas` : 'permanente';
    await interaction.reply(`✅ Boost de **${percent}%** añadido ${durationText}`);
  }
  else if (subcommand === 'list') {
    const now = Date.now();
    const result = await pool.query(
      'SELECT * FROM boosts WHERE guild_id = $1 AND (expires_at IS NULL OR expires_at > $2)',
      [interaction.guild.id, now]
    );
    
    if (result.rows.length === 0) {
      return interaction.reply('📊 No hay boosts activos en el servidor.');
    }
    
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('📊 Boosts Activos')
      .setTimestamp();
    
    const userBoosts = result.rows.filter(b => b.type === 'user');
    const channelBoosts = result.rows.filter(b => b.type === 'channel');
    const globalBoosts = result.rows.filter(b => b.type === 'global');
    
    if (userBoosts.length > 0) {
      const userText = userBoosts.map(b => {
        const expires = b.expires_at ? `<t:${Math.floor(b.expires_at / 1000)}:R>` : 'Permanente';
        return `<@${b.target_id}>: **${b.boost_percent}%** - ${expires}`;
      }).join('\n');
      embed.addFields({ name: '👤 Usuarios', value: userText });
    }
    
    if (channelBoosts.length > 0) {
      const channelText = channelBoosts.map(b => {
        const expires = b.expires_at ? `<t:${Math.floor(b.expires_at / 1000)}:R>` : 'Permanente';
        return `<#${b.target_id}>: **${b.boost_percent}%** - ${expires}`;
      }).join('\n');
      embed.addFields({ name: '📝 Canales', value: channelText });
    }
    
    if (globalBoosts.length > 0) {
      const globalText = globalBoosts.map(b => {
        const expires = b.expires_at ? `<t:${Math.floor(b.expires_at / 1000)}:R>` : 'Permanente';
        return `Global: **${b.boost_percent}%** - ${expires}`;
      }).join('\n');
      embed.addFields({ name: '🌍 Global', value: globalText });
    }
    
    await interaction.reply({ embeds: [embed] });
  }
  else if (subcommand === 'status') {
    const totalBoost = await getTotalBoostMultiplier(interaction.user.id, interaction.guild.id);
    
    const embed = new EmbedBuilder()
      .setColor('#43B581')
      .setTitle('📊 Tu Estado de Boosts')
      .setDescription(`Boost total actual: **${totalBoost}%**`)
      .setTimestamp();
    
    const member = interaction.member;
    if (member.roles.cache.has(CONFIG.BOOSTER_ROLE_ID)) {
      embed.addFields({ name: '🚀 Booster', value: `+${CONFIG.BOOSTER_VIP_BOOST}%` });
    }
    if (member.roles.cache.has(CONFIG.VIP_ROLE_ID)) {
      embed.addFields({ name: '👑 VIP', value: `+${CONFIG.BOOSTER_VIP_BOOST}%` });
    }
    
    await interaction.reply({ embeds: [embed] });
  }
}

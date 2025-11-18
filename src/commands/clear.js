import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { CONFIG } from '../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('[Staff] Comandos de limpieza')
  .addSubcommand(subcommand =>
    subcommand
      .setName('levelroles')
      .setDescription('Quitar TODOS los roles de niveles a TODOS los usuarios')
  );

export async function execute(interaction) {
  if (!interaction.member.roles.cache.has(CONFIG.STAFF_ROLE_ID) && 
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
  }
  
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('confirm_clear')
        .setLabel('Confirmar')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('⚠️'),
      new ButtonBuilder()
        .setCustomId('cancel_clear')
        .setLabel('Cancelar')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌')
    );
  
  const response = await interaction.reply({
    content: '⚠️ **ADVERTENCIA CRÍTICA:** Estás a punto de quitar TODOS los roles de niveles a TODOS los miembros del servidor.\n\nEsta acción no se puede deshacer fácilmente.\n\n¿Estás completamente seguro?',
    components: [row],
    ephemeral: true
  });
  
  const collector = response.createMessageComponentCollector({ time: 30000 });
  
  collector.on('collect', async i => {
    if (i.user.id !== interaction.user.id) {
      return i.reply({ content: '❌ Solo quien ejecutó el comando puede confirmar.', ephemeral: true });
    }
    
    if (i.customId === 'confirm_clear') {
      await i.update({ content: '⏳ Limpiando roles de niveles...', components: [] });
      
      const levelRoles = Object.values(CONFIG.LEVEL_REWARDS);
      const members = await interaction.guild.members.fetch();
      let count = 0;
      
      for (const [, member] of members) {
        for (const roleId of levelRoles) {
          if (member.roles.cache.has(roleId)) {
            try {
              await member.roles.remove(roleId);
              count++;
            } catch (error) {
              console.error(`Error removing role from ${member.user.tag}:`, error);
            }
          }
        }
      }
      
      await i.editReply({ content: `✅ Se han quitado ${count} roles de niveles de todos los usuarios.` });
    } else {
      await i.update({ content: '✅ Acción cancelada.', components: [] });
    }
    
    collector.stop();
  });
  
  collector.on('end', (collected) => {
    if (collected.size === 0) {
      interaction.editReply({ content: '⏰ Tiempo agotado. Acción cancelada.', components: [] });
    }
  });
}

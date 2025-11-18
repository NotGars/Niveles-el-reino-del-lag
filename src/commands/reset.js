import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { resetAllUsers } from '../utils/xpManager.js';
import { CONFIG } from '../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('reset')
  .setDescription('[Staff] Resetear temporada')
  .addSubcommand(subcommand =>
    subcommand
      .setName('temporada')
      .setDescription('Resetear XP y niveles de todos los usuarios')
  );

export async function execute(interaction) {
  if (!interaction.member.roles.cache.has(CONFIG.STAFF_ROLE_ID) && 
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
  }
  
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('confirm_reset')
        .setLabel('Confirmar Reset')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('⚠️'),
      new ButtonBuilder()
        .setCustomId('cancel_reset')
        .setLabel('Cancelar')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌')
    );
  
  const response = await interaction.reply({
    content: '⚠️ **ADVERTENCIA:** Estás a punto de resetear TODA la XP y niveles de TODOS los usuarios del servidor.\n\n¿Estás seguro?',
    components: [row],
    ephemeral: true
  });
  
  const collector = response.createMessageComponentCollector({ time: 30000 });
  
  collector.on('collect', async i => {
    if (i.user.id !== interaction.user.id) {
      return i.reply({ content: '❌ Solo quien ejecutó el comando puede confirmar.', ephemeral: true });
    }
    
    if (i.customId === 'confirm_reset') {
      await i.update({ content: '⏳ Reseteando temporada...', components: [] });
      await resetAllUsers(interaction.guild.id);
      await i.editReply({ content: '✅ Se ha reseteado la temporada. Todos los usuarios vuelven a nivel 0.' });
    } else {
      await i.update({ content: '✅ Reset cancelado.', components: [] });
    }
    
    collector.stop();
  });
  
  collector.on('end', (collected) => {
    if (collected.size === 0) {
      interaction.editReply({ content: '⏰ Tiempo agotado. Reset cancelado.', components: [] });
    }
  });
}

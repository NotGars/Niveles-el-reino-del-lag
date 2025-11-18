import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getUser, setXP, resetUser } from '../utils/xpManager.js';
import { CONFIG } from '../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('xp')
  .setDescription('[Staff] Gestionar XP de usuarios')
  .addSubcommand(subcommand =>
    subcommand
      .setName('add')
      .setDescription('Añadir XP a un usuario')
      .addUserOption(option =>
        option.setName('usuario')
          .setDescription('Usuario')
          .setRequired(true)
      )
      .addIntegerOption(option =>
        option.setName('cantidad')
          .setDescription('Cantidad de XP')
          .setRequired(true)
          .setMinValue(1)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('remove')
      .setDescription('Quitar XP a un usuario')
      .addUserOption(option =>
        option.setName('usuario')
          .setDescription('Usuario')
          .setRequired(true)
      )
      .addIntegerOption(option =>
        option.setName('cantidad')
          .setDescription('Cantidad de XP')
          .setRequired(true)
          .setMinValue(1)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('reset')
      .setDescription('Resetear toda la XP y niveles de un usuario')
      .addUserOption(option =>
        option.setName('usuario')
          .setDescription('Usuario')
          .setRequired(true)
      )
  );

export async function execute(interaction) {
  if (!interaction.member.roles.cache.has(CONFIG.STAFF_ROLE_ID) && 
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
  }
  
  const subcommand = interaction.options.getSubcommand();
  const targetUser = interaction.options.getUser('usuario');
  
  if (subcommand === 'add') {
    const amount = interaction.options.getInteger('cantidad');
    await setXP(targetUser.id, interaction.guild.id, amount);
    await interaction.reply(`✅ Se han añadido **${amount} XP** a ${targetUser}`);
  }
  else if (subcommand === 'remove') {
    const amount = interaction.options.getInteger('cantidad');
    await setXP(targetUser.id, interaction.guild.id, -amount);
    await interaction.reply(`✅ Se han quitado **${amount} XP** a ${targetUser}`);
  }
  else if (subcommand === 'reset') {
    await resetUser(targetUser.id, interaction.guild.id);
    await interaction.reply(`✅ Se ha reseteado toda la XP y niveles de ${targetUser}`);
  }
}

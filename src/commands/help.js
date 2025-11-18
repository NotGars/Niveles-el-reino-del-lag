import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { CONFIG } from '../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Muestra los comandos disponibles')
  .addStringOption(option =>
    option.setName('tipo')
      .setDescription('Tipo de ayuda')
      .setRequired(false)
      .addChoices(
        { name: 'Usuario', value: 'user' },
        { name: 'Staff', value: 'staff' }
      )
  );

export async function execute(interaction) {
  const type = interaction.options.getString('tipo');
  const isStaff = interaction.member.roles.cache.has(CONFIG.STAFF_ROLE_ID) || 
                  interaction.member.permissions.has(PermissionFlagsBits.Administrator);
  
  if (type === 'staff' || (type === null && isStaff)) {
    if (!isStaff) {
      return interaction.reply({ content: '❌ No tienes acceso a los comandos de staff.', ephemeral: true });
    }
    
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('📋 Comandos de Staff')
      .setDescription('Comandos disponibles para el staff del servidor:')
      .addFields(
        { name: '/addlevel', value: 'Añadir niveles a un usuario' },
        { name: '/removelevel', value: 'Quitar niveles a un usuario' },
        { name: '/setlevel', value: 'Establecer nivel de un usuario' },
        { name: '/xp add/remove/reset', value: 'Gestionar XP de usuarios' },
        { name: '/boost add', value: 'Añadir boost a usuario o canal' },
        { name: '/globalboost add/remove', value: 'Gestionar boost global del servidor' },
        { name: '/ban user/channel', value: 'Banear de ganar XP' },
        { name: '/unban user/channel', value: 'Desbanear de ganar XP' },
        { name: '/reset temporada', value: 'Resetear XP y niveles de todos' },
        { name: '/clear levelroles', value: 'Quitar todos los roles de niveles' },
        { name: '/embed', value: 'Crear embeds personalizados' },
        { name: '/mensaje', value: 'Enviar mensajes planos' }
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } else {
    const embed = new EmbedBuilder()
      .setColor('#43B581')
      .setTitle('📋 Comandos de Usuario')
      .setDescription('Comandos disponibles para todos los usuarios:')
      .addFields(
        { name: '/level [usuario]', value: 'Muestra tu nivel o el de otro usuario' },
        { name: '/nivel [usuario]', value: 'Alias de /level' },
        { name: '/rank [usuario]', value: 'Alias de /level' },
        { name: '/leaderboard', value: 'Muestra el top 10 del servidor' },
        { name: '/lb', value: 'Alias de /leaderboard' },
        { name: '/rewards list', value: 'Muestra las recompensas por nivel' },
        { name: '/boost list', value: 'Ver lista de boosts activos' },
        { name: '/boost status', value: 'Ver tu estado de boosts' },
        { name: '/minijuego trivia', value: 'Jugar trivia de 5 preguntas' },
        { name: '/minijuego rps', value: 'Piedra, Papel o Tijera vs otro jugador' },
        { name: '/minijuego roulette', value: 'Ruleta rusa vs otro jugador' },
        { name: '/minijuego ahorcado', value: 'Ahorcado solitario de 3 rondas' }
      )
      .setFooter({ text: '¡Gana XP chateando, enviando imágenes y reaccionando!' })
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  }
}

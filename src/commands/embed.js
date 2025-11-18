import { SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } from 'discord.js';
import { CONFIG } from '../config/constants.js';

export const data = new SlashCommandBuilder()
  .setName('embed')
  .setDescription('[Staff] Crear un embed personalizado');

export async function execute(interaction) {
  if (!interaction.member.roles.cache.has(CONFIG.STAFF_ROLE_ID) && 
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({ content: '❌ No tienes permiso para usar este comando.', ephemeral: true });
  }
  
  const modal = new ModalBuilder()
    .setCustomId('embed_modal')
    .setTitle('Crear Embed Personalizado');
  
  const titleInput = new TextInputBuilder()
    .setCustomId('embed_title')
    .setLabel('Título del Embed')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);
  
  const descriptionInput = new TextInputBuilder()
    .setCustomId('embed_description')
    .setLabel('Descripción')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);
  
  const colorInput = new TextInputBuilder()
    .setCustomId('embed_color')
    .setLabel('Color (hex, ej: #FF5733 o nombre)')
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setValue('#7289DA');
  
  const imageInput = new TextInputBuilder()
    .setCustomId('embed_image')
    .setLabel('URL de Imagen (opcional)')
    .setStyle(TextInputStyle.Short)
    .setRequired(false);
  
  const footerInput = new TextInputBuilder()
    .setCustomId('embed_footer')
    .setLabel('Footer (opcional)')
    .setStyle(TextInputStyle.Short)
    .setRequired(false);
  
  modal.addComponents(
    new ActionRowBuilder().addComponents(titleInput),
    new ActionRowBuilder().addComponents(descriptionInput),
    new ActionRowBuilder().addComponents(colorInput),
    new ActionRowBuilder().addComponents(imageInput),
    new ActionRowBuilder().addComponents(footerInput)
  );
  
  await interaction.showModal(modal);
  
  const filter = i => i.customId === 'embed_modal' && i.user.id === interaction.user.id;
  
  try {
    const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 300000 });
    
    const title = modalInteraction.fields.getTextInputValue('embed_title');
    const description = modalInteraction.fields.getTextInputValue('embed_description');
    const color = modalInteraction.fields.getTextInputValue('embed_color') || '#7289DA';
    const image = modalInteraction.fields.getTextInputValue('embed_image');
    const footer = modalInteraction.fields.getTextInputValue('embed_footer');
    
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setTimestamp();
    
    if (image) embed.setImage(image);
    if (footer) embed.setFooter({ text: footer });
    
    await modalInteraction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Modal timeout:', error);
  }
}

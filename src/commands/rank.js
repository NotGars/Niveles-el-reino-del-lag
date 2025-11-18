import { SlashCommandBuilder } from 'discord.js';
import { execute as levelExecute } from './level.js';

export const data = new SlashCommandBuilder()
  .setName('rank')
  .setDescription('Muestra el nivel de un usuario')
  .addUserOption(option =>
    option.setName('usuario')
      .setDescription('Usuario a consultar')
      .setRequired(false)
  );

export const execute = levelExecute;

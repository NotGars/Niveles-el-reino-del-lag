import { SlashCommandBuilder } from 'discord.js';
import { execute as leaderboardExecute } from './leaderboard.js';

export const data = new SlashCommandBuilder()
  .setName('lb')
  .setDescription('Muestra la tabla de clasificación del servidor');

export const execute = leaderboardExecute;

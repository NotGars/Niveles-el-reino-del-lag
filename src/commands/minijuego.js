import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { getCooldown, setCooldown, formatTimeRemaining } from '../utils/cooldownManager.js';
import { addBoost, setLevel, getUser } from '../utils/xpManager.js';
import { CONFIG } from '../config/constants.js';
import { getRandomQuestions } from '../minigames/trivia.js';

export const data = new SlashCommandBuilder()
  .setName('minijuego')
  .setDescription('Jugar minijuegos para ganar recompensas')
  .addSubcommand(subcommand =>
    subcommand
      .setName('trivia')
      .setDescription('Responde 5 preguntas de trivia')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('rps')
      .setDescription('Piedra, Papel o Tijera contra otro jugador')
      .addUserOption(option =>
        option.setName('oponente')
          .setDescription('Usuario contra el que jugar')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('roulette')
      .setDescription('Ruleta rusa (¡cuidado!)')
      .addUserOption(option =>
        option.setName('oponente')
          .setDescription('Usuario contra el que jugar')
          .setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('ahorcado')
      .setDescription('Ahorcado solitario')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('ahorcado_vs')
      .setDescription('Ahorcado contra otro jugador')
      .addUserOption(option =>
        option.setName('oponente')
          .setDescription('Usuario contra el que jugar')
          .setRequired(true)
      )
  );

export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand();
  
  if (subcommand === 'trivia') {
    await handleTrivia(interaction);
  } else if (subcommand === 'rps') {
    await handleRPS(interaction);
  } else if (subcommand === 'roulette') {
    await handleRoulette(interaction);
  } else if (subcommand === 'ahorcado') {
    await handleHangmanSolo(interaction);
  } else if (subcommand === 'ahorcado_vs') {
    await handleHangmanVS(interaction);
  }
}

async function handleTrivia(interaction) {
  const cooldown = await getCooldown(interaction.user.id, interaction.guild.id, 'trivia_reward');
  
  if (cooldown) {
    return interaction.reply({
      content: `⏰ Podrás obtener recompensas en: **${formatTimeRemaining(cooldown)}**\nPero puedes seguir jugando sin recompensas.`,
      ephemeral: true
    });
  }
  
  const questions = getRandomQuestions(5);
  let currentQuestion = 0;
  let correctAnswers = 0;
  let allCorrectFirstTry = true;
  
  async function askQuestion() {
    if (currentQuestion >= questions.length) {
      if (correctAnswers === 5 && allCorrectFirstTry) {
        const embed = new EmbedBuilder()
          .setColor('#FFD700')
          .setTitle('🎉 ¡Perfecto! ¡Todas correctas!')
          .setDescription('Elige tu recompensa:')
          .setTimestamp();
        
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('trivia_boost')
              .setLabel(`Boost ${CONFIG.TRIVIA_REWARD_BOOST}% x 12h`)
              .setStyle(ButtonStyle.Primary)
              .setEmoji('⚡'),
            new ButtonBuilder()
              .setCustomId('trivia_levels')
              .setLabel(`+${CONFIG.TRIVIA_REWARD_LEVELS} Niveles`)
              .setStyle(ButtonStyle.Success)
              .setEmoji('📈')
          );
        
        const response = await interaction.editReply({ embeds: [embed], components: [row] });
        
        const collector = response.createMessageComponentCollector({ time: 60000 });
        
        collector.on('collect', async i => {
          if (i.user.id !== interaction.user.id) {
            return i.reply({ content: '❌ Esta recompensa no es para ti.', ephemeral: true });
          }
          
          if (i.customId === 'trivia_boost') {
            await addBoost('user', interaction.user.id, interaction.guild.id, CONFIG.TRIVIA_REWARD_BOOST, 12 * 60 * 60 * 1000);
            await setCooldown(interaction.user.id, interaction.guild.id, 'trivia_reward', CONFIG.TRIVIA_COOLDOWN);
            await i.update({ content: `✅ ¡Has recibido un boost de ${CONFIG.TRIVIA_REWARD_BOOST}% durante 12 horas!`, embeds: [], components: [] });
          } else {
            const userData = await getUser(interaction.user.id, interaction.guild.id);
            const newLevel = parseFloat(userData.level) + CONFIG.TRIVIA_REWARD_LEVELS;
            await setLevel(interaction.user.id, interaction.guild.id, Math.floor(newLevel));
            await setCooldown(interaction.user.id, interaction.guild.id, 'trivia_reward', CONFIG.TRIVIA_COOLDOWN);
            await i.update({ content: `✅ ¡Has ganado ${CONFIG.TRIVIA_REWARD_LEVELS} niveles!`, embeds: [], components: [] });
          }
          collector.stop();
        });
      } else {
        await interaction.editReply({
          content: `📊 Juego terminado. Respuestas correctas: **${correctAnswers}/5**\nIntenta nuevamente para obtener 5/5 en el primer intento.`,
          components: []
        });
      }
      return;
    }
    
    const q = questions[currentQuestion];
    
    const embed = new EmbedBuilder()
      .setColor('#7289DA')
      .setTitle(`❓ Pregunta ${currentQuestion + 1}/5`)
      .setDescription(q.question)
      .setFooter({ text: `Correctas hasta ahora: ${correctAnswers}` });
    
    const row = new ActionRowBuilder();
    q.options.forEach((option, index) => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`answer_${index}`)
          .setLabel(option)
          .setStyle(ButtonStyle.Secondary)
      );
    });
    
    let message;
    if (currentQuestion === 0) {
      await interaction.reply({ embeds: [embed], components: [row] });
      message = await interaction.fetchReply();
    } else {
      message = await interaction.editReply({ embeds: [embed], components: [row] });
    }
    
    const collector = message.createMessageComponentCollector({ time: 20000 });
    
    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: '❌ Este juego no es para ti.', ephemeral: true });
      }
      
      const answerIndex = parseInt(i.customId.split('_')[1]);
      
      if (answerIndex === q.correct) {
        correctAnswers++;
        await i.update({ content: '✅ ¡Correcto!', components: [] });
      } else {
        allCorrectFirstTry = false;
        await i.update({ content: `❌ Incorrecto. La respuesta correcta era: **${q.options[q.correct]}**`, components: [] });
      }
      
      currentQuestion++;
      collector.stop();
      setTimeout(() => askQuestion(), 2000);
    });
    
    collector.on('end', (collected) => {
      if (collected.size === 0) {
        interaction.editReply({ content: '⏰ Tiempo agotado.', components: [] });
      }
    });
  }
  
  askQuestion();
}

async function handleRPS(interaction) {
  const opponent = interaction.options.getUser('oponente');
  
  if (opponent.id === interaction.user.id) {
    return interaction.reply({ content: '❌ No puedes jugar contra ti mismo.', ephemeral: true });
  }
  
  if (opponent.bot) {
    return interaction.reply({ content: '❌ No puedes jugar contra un bot.', ephemeral: true });
  }
  
  const cooldown = await getCooldown(interaction.user.id, interaction.guild.id, 'rps_reward');
  const canGetReward = !cooldown;
  
  const embed = new EmbedBuilder()
    .setColor('#43B581')
    .setTitle('🎮 Piedra, Papel o Tijera')
    .setDescription(`${opponent}, ${interaction.user} te ha retado a jugar Piedra, Papel o Tijera al mejor de 3.\n\n${canGetReward ? '**El ganador recibirá un boost del 30% durante 2 horas!**' : '*Sin recompensa esta vez (cooldown activo)*'}`)
    .setTimestamp();
  
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('rps_accept')
        .setLabel('Aceptar')
        .setStyle(ButtonStyle.Success)
        .setEmoji('✅'),
      new ButtonBuilder()
        .setCustomId('rps_decline')
        .setLabel('Rechazar')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('❌')
    );
  
  const response = await interaction.reply({ content: `${opponent}`, embeds: [embed], components: [row] });
  
  const collector = response.createMessageComponentCollector({ time: 60000 });
  
  collector.on('collect', async i => {
    if (i.user.id !== opponent.id) {
      return i.reply({ content: '❌ Este desafío no es para ti.', ephemeral: true });
    }
    
    if (i.customId === 'rps_decline') {
      await i.update({ content: `${opponent} ha rechazado el desafío.`, embeds: [], components: [] });
      collector.stop();
      return;
    }
    
    await i.update({ content: '¡Juego aceptado! Iniciando...', embeds: [], components: [] });
    collector.stop();
    
    await playRPSGame(interaction, interaction.user, opponent, canGetReward);
  });
}

async function playRPSGame(interaction, player1, player2, canGetReward) {
  let p1Wins = 0;
  let p2Wins = 0;
  let round = 1;
  
  const choices = ['🪨 Piedra', '📄 Papel', '✂️ Tijera'];
  
  while (p1Wins < 3 && p2Wins < 3) {
    const embed = new EmbedBuilder()
      .setColor('#43B581')
      .setTitle(`⚔️ Ronda ${round}`)
      .setDescription(`${player1}: ${p1Wins} victorias\n${player2}: ${p2Wins} victorias\n\n¡Ambos jugadores, elijan!`)
      .setTimestamp();
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('choice_0')
          .setLabel('Piedra')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🪨'),
        new ButtonBuilder()
          .setCustomId('choice_1')
          .setLabel('Papel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('📄'),
        new ButtonBuilder()
          .setCustomId('choice_2')
          .setLabel('Tijera')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('✂️')
      );
    
    await interaction.editReply({ embeds: [embed], components: [row] });
    const message = await interaction.fetchReply();
    
    const p1Choice = await getPlayerChoice(message, player1.id);
    const p2Choice = await getPlayerChoice(message, player2.id);
    
    if (p1Choice === null || p2Choice === null) {
      await interaction.editReply({ content: '⏰ Tiempo agotado. Juego cancelado.', embeds: [], components: [] });
      return;
    }
    
    const winner = determineWinner(p1Choice, p2Choice);
    
    if (winner === 1) {
      p1Wins++;
      await interaction.editReply({
        content: `${player1} eligió ${choices[p1Choice]}\n${player2} eligió ${choices[p2Choice]}\n\n✅ **${player1} gana esta ronda!**`,
        embeds: [],
        components: []
      });
    } else if (winner === 2) {
      p2Wins++;
      await interaction.editReply({
        content: `${player1} eligió ${choices[p1Choice]}\n${player2} eligió ${choices[p2Choice]}\n\n✅ **${player2} gana esta ronda!**`,
        embeds: [],
        components: []
      });
    } else {
      await interaction.editReply({
        content: `${player1} eligió ${choices[p1Choice]}\n${player2} eligió ${choices[p2Choice]}\n\n🤝 **Empate!**`,
        embeds: [],
        components: []
      });
    }
    
    round++;
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  const winner = p1Wins === 3 ? player1 : player2;
  
  if (canGetReward) {
    await addBoost('user', winner.id, interaction.guild.id, CONFIG.RPS_REWARD_BOOST, 2 * 60 * 60 * 1000);
    await setCooldown(interaction.user.id, interaction.guild.id, 'rps_reward', CONFIG.RPS_COOLDOWN);
    await interaction.editReply({
      content: `🎉 **${winner} ha ganado el juego!**\n✨ Ha recibido un boost del ${CONFIG.RPS_REWARD_BOOST}% durante 2 horas!`
    });
  } else {
    await interaction.editReply({
      content: `🎉 **${winner} ha ganado el juego!**`
    });
  }
}

async function getPlayerChoice(message, playerId) {
  return new Promise((resolve) => {
    const collector = message.createMessageComponentCollector({ time: 20000 });
    
    collector.on('collect', async i => {
      if (i.user.id !== playerId) {
        return i.reply({ content: '❌ No es tu turno.', ephemeral: true });
      }
      
      const choice = parseInt(i.customId.split('_')[1]);
      await i.reply({ content: '✅ Elección registrada!', ephemeral: true });
      collector.stop();
      resolve(choice);
    });
    
    collector.on('end', (collected) => {
      if (collected.size === 0) {
        resolve(null);
      }
    });
  });
}

function determineWinner(p1Choice, p2Choice) {
  if (p1Choice === p2Choice) return 0;
  if ((p1Choice === 0 && p2Choice === 2) || 
      (p1Choice === 1 && p2Choice === 0) || 
      (p1Choice === 2 && p2Choice === 1)) {
    return 1;
  }
  return 2;
}

async function handleRoulette(interaction) {
  const opponent = interaction.options.getUser('oponente');
  
  if (opponent.id === interaction.user.id) {
    return interaction.reply({ content: '❌ No puedes jugar contra ti mismo.', ephemeral: true });
  }
  
  if (opponent.bot) {
    return interaction.reply({ content: '❌ No puedes jugar contra un bot.', ephemeral: true });
  }
  
  const cooldown = await getCooldown(interaction.user.id, interaction.guild.id, 'roulette_reward');
  const canGetReward = !cooldown;
  
  const embed = new EmbedBuilder()
    .setColor('#8B0000')
    .setTitle('💀 RULETA RUSA 💀')
    .setDescription(`${opponent}, ${interaction.user} te ha retado a jugar Ruleta Rusa.\n\n⚠️ **ADVERTENCIA:** ${canGetReward ? '**El ganador recibe +2.5 niveles**\n**El perdedor pierde -3 niveles**' : '*Sin recompensas/penalizaciones (cooldown activo)*'}`)
    .setTimestamp();
  
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('roulette_accept')
        .setLabel('Acepto el riesgo')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('💀'),
      new ButtonBuilder()
        .setCustomId('roulette_decline')
        .setLabel('Rechazar')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('❌')
    );
  
  const response = await interaction.reply({ content: `${opponent}`, embeds: [embed], components: [row] });
  
  const collector = response.createMessageComponentCollector({ time: 60000 });
  
  collector.on('collect', async i => {
    if (i.user.id !== opponent.id) {
      return i.reply({ content: '❌ Este desafío no es para ti.', ephemeral: true });
    }
    
    if (i.customId === 'roulette_decline') {
      await i.update({ content: `${opponent} ha rechazado el desafío.`, embeds: [], components: [] });
      collector.stop();
      return;
    }
    
    await i.update({ content: '💀 ¡Juego aceptado! Preparando el revólver...', embeds: [], components: [] });
    collector.stop();
    
    await playRouletteGame(interaction, interaction.user, opponent, canGetReward);
  });
}

async function playRouletteGame(interaction, player1, player2, canGetReward) {
  const players = [player1, player2];
  let chambers = [false, false, false, false, false, false];
  const bulletPosition = Math.floor(Math.random() * 6);
  chambers[bulletPosition] = true;
  
  let currentPlayer = Math.random() < 0.5 ? 0 : 1;
  let shotNumber = 0;
  
  await interaction.editReply({ content: '🔫 Girando el tambor...' });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  while (true) {
    shotNumber++;
    const player = players[currentPlayer];
    
    const embed = new EmbedBuilder()
      .setColor('#8B0000')
      .setTitle(`💀 Turno ${shotNumber}`)
      .setDescription(`${player}, es tu turno de disparar...\n\nCámaras restantes: ${7 - shotNumber}\nProbabilidad: ${Math.round((1 / (7 - shotNumber)) * 100)}%`)
      .setTimestamp();
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('shoot')
          .setLabel('Disparar')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🔫')
      );
    
    await interaction.editReply({ embeds: [embed], components: [row] });
    const message = await interaction.fetchReply();
    
    const filter = i => i.user.id === player.id && i.customId === 'shoot';
    const collector = message.createMessageComponentCollector({ filter, time: 30000 });
    
    const collected = await new Promise(resolve => {
      collector.on('collect', async i => {
        await i.deferUpdate();
        collector.stop();
        resolve(true);
      });
      
      collector.on('end', collected => {
        if (collected.size === 0) resolve(false);
      });
    });
    
    if (!collected) {
      await interaction.editReply({ content: '⏰ Tiempo agotado. Juego cancelado.', embeds: [], components: [] });
      return;
    }
    
    await interaction.editReply({ content: `${player} aprieta el gatillo...`, embeds: [], components: [] });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (chambers[shotNumber - 1]) {
      const loser = player;
      const winner = players[1 - currentPlayer];
      
      if (canGetReward) {
        const loserData = await getUser(loser.id, interaction.guild.id);
        const winnerData = await getUser(winner.id, interaction.guild.id);
        
        const newLoserLevel = Math.max(0, parseFloat(loserData.level) - CONFIG.ROULETTE_LOSE_LEVELS);
        const newWinnerLevel = parseFloat(winnerData.level) + CONFIG.ROULETTE_WIN_LEVELS;
        
        await setLevel(loser.id, interaction.guild.id, Math.floor(newLoserLevel));
        await setLevel(winner.id, interaction.guild.id, Math.floor(newWinnerLevel));
        await setCooldown(interaction.user.id, interaction.guild.id, 'roulette_reward', CONFIG.ROULETTE_COOLDOWN);
        
        await interaction.editReply({
          content: `💥 **BANG!** 💥\n\n${loser} ha perdido y pierde **${CONFIG.ROULETTE_LOSE_LEVELS} niveles**!\n${winner} gana **+${CONFIG.ROULETTE_WIN_LEVELS} niveles**!`
        });
      } else {
        await interaction.editReply({
          content: `💥 **BANG!** 💥\n\n${loser} ha perdido!\n${winner} sobrevive!`
        });
      }
      return;
    } else {
      await interaction.editReply({ content: `💨 *Clic* - ${player} sobrevive...`, embeds: [], components: [] });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    currentPlayer = 1 - currentPlayer;
  }
}

async function handleHangmanSolo(interaction) {
  const cooldown = await getCooldown(interaction.user.id, interaction.guild.id, 'hangman_reward');
  const canGetReward = !cooldown;
  
  const words = [
    'PROGRAMAR', 'DISCORD', 'JAVASCRIPT', 'PYTHON', 'VIDEOJUEGO',
    'COMPUTADORA', 'TECLADO', 'MONITOR', 'INTERNET', 'SERVIDOR',
    'MENSAJE', 'COMANDO', 'USUARIO', 'AVATAR', 'EMOJI'
  ];
  
  let currentRound = 1;
  
  async function playRound() {
    const word = words[Math.floor(Math.random() * words.length)];
    let guessed = Array(word.length).fill('_');
    let attempts = 5;
    let usedLetters = [];
    
    const embed = new EmbedBuilder()
      .setColor('#43B581')
      .setTitle(`🎯 Ahorcado - Ronda ${currentRound}/3`)
      .setDescription(`Palabra: ${guessed.join(' ')}\nIntentos restantes: ${attempts}\n\n${canGetReward && currentRound === 1 ? '**Completa las 3 rondas para obtener recompensa!**' : ''}`)
      .setTimestamp();
    
    if (currentRound === 1) {
      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.editReply({ embeds: [embed] });
    }
    
    await interaction.followUp({
      content: 'Escribe una letra en el chat para adivinar:',
      ephemeral: true
    });
    
    const filter = m => m.author.id === interaction.user.id && m.content.length === 1;
    const collector = interaction.channel.createMessageCollector({ filter, time: 120000 });
    
    const result = await new Promise(resolve => {
      collector.on('collect', async m => {
        const letter = m.content.toUpperCase();
        
        if (usedLetters.includes(letter)) {
          m.react('🔁');
          return;
        }
        
        usedLetters.push(letter);
        
        if (word.includes(letter)) {
          for (let i = 0; i < word.length; i++) {
            if (word[i] === letter) {
              guessed[i] = letter;
            }
          }
          m.react('✅');
        } else {
          attempts--;
          m.react('❌');
        }
        
        const embedUpdate = new EmbedBuilder()
          .setColor('#43B581')
          .setTitle(`🎯 Ahorcado - Ronda ${currentRound}/3`)
          .setDescription(`Palabra: ${guessed.join(' ')}\nIntentos restantes: ${attempts}\nLetras usadas: ${usedLetters.join(', ')}`)
          .setTimestamp();
        
        await interaction.editReply({ embeds: [embedUpdate] });
        
        if (!guessed.includes('_')) {
          collector.stop();
          resolve(true);
        } else if (attempts === 0) {
          collector.stop();
          resolve(false);
        }
      });
      
      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          resolve(false);
        }
      });
    });
    
    return result;
  }
  
  for (let round = 1; round <= 3; round++) {
    currentRound = round;
    const won = await playRound();
    
    if (!won) {
      await interaction.editReply({ content: `❌ Has perdido en la ronda ${round}. ¡Inténtalo de nuevo!` });
      return;
    }
    
    if (round < 3) {
      await interaction.editReply({ content: `✅ ¡Ronda ${round} completada! Pasando a la siguiente...` });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  if (canGetReward) {
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🎉 ¡Has completado las 3 rondas!')
      .setDescription('Elige tu recompensa:')
      .setTimestamp();
    
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('hangman_boost')
          .setLabel(`Boost ${CONFIG.HANGMAN_REWARD_BOOST}% x 4h`)
          .setStyle(ButtonStyle.Primary)
          .setEmoji('⚡'),
        new ButtonBuilder()
          .setCustomId('hangman_level')
          .setLabel(`+${CONFIG.HANGMAN_REWARD_LEVELS} Nivel`)
          .setStyle(ButtonStyle.Success)
          .setEmoji('📈')
      );
    
    const response = await interaction.editReply({ embeds: [embed], components: [row] });
    
    const collector = response.createMessageComponentCollector({ time: 60000 });
    
    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: '❌ Esta recompensa no es para ti.', ephemeral: true });
      }
      
      if (i.customId === 'hangman_boost') {
        await addBoost('user', interaction.user.id, interaction.guild.id, CONFIG.HANGMAN_REWARD_BOOST, 4 * 60 * 60 * 1000);
        await setCooldown(interaction.user.id, interaction.guild.id, 'hangman_reward', CONFIG.HANGMAN_SOLO_COOLDOWN);
        await i.update({ content: `✅ ¡Has recibido un boost de ${CONFIG.HANGMAN_REWARD_BOOST}% durante 4 horas!`, embeds: [], components: [] });
      } else {
        const userData = await getUser(interaction.user.id, interaction.guild.id);
        const newLevel = parseInt(userData.level) + CONFIG.HANGMAN_REWARD_LEVELS;
        await setLevel(interaction.user.id, interaction.guild.id, newLevel);
        await setCooldown(interaction.user.id, interaction.guild.id, 'hangman_reward', CONFIG.HANGMAN_SOLO_COOLDOWN);
        await i.update({ content: `✅ ¡Has ganado ${CONFIG.HANGMAN_REWARD_LEVELS} nivel!`, embeds: [], components: [] });
      }
      collector.stop();
    });
  } else {
    await interaction.editReply({ content: '🎉 ¡Has completado las 3 rondas!' });
  }
}

async function handleHangmanVS(interaction) {
  await interaction.reply({ content: '🚧 Ahorcado multijugador estará disponible próximamente.' });
}

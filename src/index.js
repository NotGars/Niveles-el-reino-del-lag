import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import { initDatabase } from './database/setup.js';
import { handleMessage } from './events/messageCreate.js';
import { handleReaction } from './events/messageReactionAdd.js';
import { startNightBoostScheduler } from './utils/nightBoost.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

async function loadCommands() {
  const commandsPath = join(__dirname, 'commands');
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  const commands = [];
  
  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = await import(`file://${filePath}`);
    
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
      console.log(`✅ Comando cargado: ${command.data.name}`);
    }
  }
  
  return commands;
}

async function registerCommands(commands) {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  
  try {
    console.log('🔄 Registrando comandos slash...');
    
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    
    console.log('✅ Comandos slash registrados exitosamente!');
  } catch (error) {
    console.error('❌ Error registrando comandos:', error);
  }
}

client.once('ready', async () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  console.log(`📊 Sirviendo en ${client.guilds.cache.size} servidores`);
  
  await initDatabase();
  
  startNightBoostScheduler(client);
  
  client.user.setActivity('¡Gana XP chateando! | /help', { type: 'PLAYING' });
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  const command = client.commands.get(interaction.commandName);
  
  if (!command) return;
  
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error ejecutando comando:', error);
    const reply = { content: '❌ Hubo un error ejecutando este comando.', ephemeral: true };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

client.on('messageCreate', async message => {
  try {
    await handleMessage(message);
  } catch (error) {
    console.error('Error en messageCreate:', error);
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
  try {
    if (reaction.partial) {
      await reaction.fetch();
    }
    await handleReaction(reaction, user);
  } catch (error) {
    console.error('Error en messageReactionAdd:', error);
  }
});

async function start() {
  try {
    const commands = await loadCommands();
    await registerCommands(commands);
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('❌ Error iniciando el bot:', error);
    process.exit(1);
  }
}

start();

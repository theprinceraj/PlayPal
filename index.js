const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  Collection,
  Intents,
  ActivityType,
  GatewayIntentBits,
  Events,
} = require('discord.js');
const path = require('node:path');
const config = require('./config.json');
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    GatewayIntentBits.Guilds,
  ],
});
const fs = require('fs');

const errorLogStream = fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' });
const originalStderrWrite = process.stderr.write;
process.stderr.write = function (error) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] Error: ${error}`;
  errorLogStream.write(logEntry);
  originalStderrWrite.call(process.stderr, logEntry);
};

client.on('ready', () => {
  console.log(`${client.user.tag} is serving in ${client.guilds.cache.size} servers.`);
  client.user.setPresence({ activities: [{ name: 'JavaScript', type: ActivityType.Competing }] });
});

client.config = config;

client.slashcommands = new Collection();
const foldersPath = path.join(__dirname, 'slashcommands');
const commandFolders = fs.readdirSync(foldersPath).filter(folder => folder.startsWith('folder'));

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.slashcommands.set(command.data.name, command);
    } else {
      console.log(`The command at ${filePath} is missing a required 'data' or 'execute' property.`);
    }
  }
}

try {
  const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
  for (const file of events) {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
  }

  client.commands = new Collection();
  const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  for (const file of commands) {
    const commandName = file.split('.')[0];
    const command = require(`./commands/${file}`);
    if (command.aliases) {
      command.aliases.forEach(alias => {
        client.commands.set(alias, command);
      });
      console.log(`Loaded ${commandName} with aliases: ${command.aliases}`);
    }
    client.commands.set(commandName, command);
    if (!command.aliases) console.log(`Loaded ${commandName} with no aliases`);
  }
} catch (error) {
  console.log(error);
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.slashcommands.get(interaction.commandName);
  if (!command) {
    console.log(`No commands matching ${interaction.commandName} was found.`);
  }

  try {
    if (interaction.deferred || interaction.replied) {
      return await interaction.followUp({
        content: 'There was an error while executing the command.(followUp)',
        ephemeral: true,
      });
    }

    return await command.execute(client, interaction);
  } catch (e) {
    console.error(e);
    await interaction
      .reply({
        content: 'There was an error while executing the command.(reply)',
        ephemeral: true,
      })
      .catch(() => null);
  }
});

client.on('messageCreate', newMessage => {
  const fs = require('fs');
  const today = new Date();
  const date = today.getUTCDate();
  const month = today.getUTCMonth() + 1;
  const year = today.getUTCFullYear();
  const hours = today.getUTCHours();
  const minutes = today.getUTCMinutes();
  const seconds = today.getUTCSeconds();
  const time = `${hours}:${minutes}:${seconds} ${date}/${month}/${year} `;
  try {
    if (
      newMessage.author.bot &&
      newMessage.embeds[0].description.includes('sent a trade request') &&
      newMessage.channel.id === '950783355614539778'
    ) {
      const thread = newMessage
        .startThread({
          name: `Send Crosstrade Proof:`,
          autoArchiveDuration: 24 * 60,
        })
        .then(thread => {
          thread.send('Please attach a screenshot proof to the above crosstrade here. It is a compulsory rule.');
          fs.appendFile('./storeroom/crosstrades.txt', `\n${time} ==> ${newMessage.url}`, error => {
            if (error) {
              console.log(error);
            }
          });
        })
        .catch(error => `Failed to create thread for ${newMessage.url}`);
    }
  } catch (error) {}
});

/*client.on('messageCreate', message => {
    try{
  if(message.channel.id === '1111996572394340362' && message.embeds[0].title.startsWith("RAID: Ends")){
       client.channels.cache.get('1108439657391325294').send("> **<@&1112934336870748251>, new monster is waiting for you!**\nRaid right now using \`sgr\`");
      client.channels.cache.get('1113809189916135434').send("**<@&1113810458349142028>, new monster is waiting for you!**\nRaid right now using \`sgr\`");
      
client.channels.cache.get('926806326900842548').send("**<@&1112004881725788210>, new monster is waiting for you!**\nRaid right now using \`sgr\`");
     
  }} catch(err) { console.error(err); }
})*/

client.on('messageCreate', message => {
  if (
    (message.author.bot && message.content.includes('before using the command.')) ||
    message.content.includes('is blacklisted in this channel.')
  )
    message.delete();
});
client.login(config.token);

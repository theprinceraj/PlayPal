const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'slashcommands');
const commandFolders = fs.readdirSync(foldersPath).filter(folder => folder.startsWith('folder'));

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath);

  for (const file of commandFiles) {
    const filesPath = path.join(commandsPath, file);
    const command = require(filesPath);

    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[⚠️] The command at ${filesPath} is missing a required "data" or "execute" property.`);
    }
  }
}

const rest = new REST().setToken(token);

(async () => {

  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const data = await rest.put(
      Routes.applicationGuildCommands(guildId),
      { body: commands },
    );

    console.log(`Succesfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    console.error(error);
  }
})();
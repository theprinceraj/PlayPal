const path = require('node:path');
const fs = require('fs');
const config = require('./config.json');

const {
	Client,
	IntentsBitField,
	Collection,
	ActivityType,
	GatewayIntentBits,
} = require('discord.js');
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		GatewayIntentBits.Guilds,
	],
});

const errorLogStream = fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' });
const originalStderrWrite = process.stderr.write;
process.stderr.write = function (error) {
	const timestamp = new Date().toISOString();
	const logEntry = `\n\n\n\n[${timestamp}] Error: ${error}`;
	errorLogStream.write(logEntry);
	originalStderrWrite.call(process.stderr, logEntry);
};

client.on('ready', () => {
	console.log(`${client.user.tag} is serving in ${client.guilds.cache.size} servers.`);
	client.user.setPresence({ activities: [{ name: 'JavaScript', type: ActivityType.Competing }] });
});

client.config = config;


const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of events) {
	const eventName = file.split('.')[0];
	const event = require(`./events/${file}`);
	client.on(eventName, event.bind(null, client));
}

client.commands = new Collection();

const commandsFolder = fs.readdirSync(`./commands`);
for (const folder of commandsFolder) {
	const commands = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	console.log(`***********>>>>>${folder}<<<<<***********`);
	for (const file of commands) {
		const commandName = file.split('.')[0];
		const command = require(`./commands/${folder}/${file}`);
		if (command.aliases) {
			command.aliases.forEach(alias => {
				client.commands.set(alias, command);
			});
			console.log(`Loaded ${commandName} with aliases: ${command.aliases}`);
		}
		client.commands.set(commandName, command);
		if (!command.aliases) console.log(`Loaded ${commandName} with no aliases`);
	}
}

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
	} catch (error) { }
});

client.on('messageCreate', message => {
	if (!['853629533855809596', '235148962103951360'].includes(message.author.id)) return;
	const descriptionVar = message.embeds[0]?.description;

	if (!descriptionVar || descriptionVar?.includes('Difficulty') === false || descriptionVar?.includes('Reroll Scrolls')) return;

	const xpRegex = /\+\d+/;
	const matchXp = descriptionVar.match(xpRegex);
	if (!matchXp) return;
	const xpGained = parseInt(matchXp[0].slice(1));

	fs.readFile('./storeroom/raiders.json', 'utf8', (err, data) => {
		if (err) {
			console.error('Error reading raiders.json', err);
			return;
		}

		const raiders = JSON.parse(data);

		const raider = message?.mentions?.users.first()?.id || descriptionVar.match(/<@(\d+)>/)[1];

		if (!raiders.hasOwnProperty(raider)) {
			raiders[raider] = {
				"raidsDone": 0,
				"elixirGained": 0,
				xpGained: 0,
				serverIdRaidedIn: [message.guildId],
			}
			console.log('NEW raider was added!');
		}

		for (server in raiders[raider].serverIdRaidedIn) {
			if (raiders[raider].serverIdRaidedIn[server] === message.guildId) {
				continue;
			} else
				raiders[raider].serverIdRaidedIn.push(message.guildId);
		}

		raiders[raider].raidsDone += 1;

		if (descriptionVar.includes('Great job defeating the monster')) {
			if (descriptionVar.includes('\nDifficulty: **Easy**')) {
				raiders[raider].elixirGained += 80;
				raiders[raider].xpGained += xpGained;
			}
			else if (descriptionVar.includes('\nDifficulty: **Medium**')) {
				raiders[raider].elixirGained += 110;
				raiders[raider].xpGained += xpGained;
			}
			else if (descriptionVar.includes('\nDifficulty: **Hard**')) {
				raiders[raider].elixirGained += 170;
				raiders[raider].xpGained += xpGained;
			}
		}
		else if (descriptionVar.includes('Better luck next time')) {
			raiders[raider].elixirGained = 20;
			raiders[raider].xpGained = xpGained;
		}

		// Convert the updated JavaScript object back to a JSON string
		const updatedData = JSON.stringify(raiders, null, 2);

		// Write the JSON string back to the raiders.json file
		fs.writeFile('./storeroom/raiders.json', updatedData, 'utf8', (err) => {
			if (err) {
				console.error('Error writing to raiders.json:', err);
				return;
			}

			if (raiders[raider].xpGained === 0) {
				console.log(message.embeds[0]);
				raiders[raider].bugged = true;
			}
		});

	});


});

client.login(config.token);
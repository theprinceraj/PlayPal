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

// client.on('messageCreate', message => {
// 	if (!['853629533855809596', '235148962103951360'].includes(message.author.id)) return;
// 	const descriptionVar = message.embeds[0]?.description;

// 	if(descriptionVar && !descriptionVar.includes('__**Conditionals**__')) return;

// 	const xpRegex = /\+\d+/;
// 	const match = descriptionVar.match(xpRegex);
// 	if(!match) return;
// 	console.log(match.slice(1));
// 	fs.readFile('./storeroom/raiders.json', 'utf8', (err, data) => {
// 		if (err) {
// 			console.error('Error reading raiders.json', err);
// 			return;
// 		}

// 		const raiders = JSON.parse(data);

// 		const raider = message.mentions.members.first().id;

// 		console.log(raider);

// 		if (!raiders.hasOwnProperty(raider)) {
// 			raiders[raider] = {
// 				"raidsDone": 0,
// 				"elixirGained": 0,
// 				xpGained: 0,
// 			}
// 		}

// 		raiders[raider].raidsDone += 1;

// 		if (descriptionVar.includes('Great job defeating the monster')) {
// 			if (descriptionVar.includes('\nDifficulty: **Easy**')) {
// 				raiders[raider].elixirGained += 60;
// 				raiders[raider].xpGained += 9000;
// 			}
// 			else if (descriptionVar.includes('\nDifficulty: **Medium**')) {
// 				raiders[raider].elixirGained += 90;
// 				raiders[raider].xpGained += 18000;
// 			}
// 			else if (descriptionVar.includes('\nDifficulty: **Hard**')) {
// 				raiders[raider].elixirGained += 150;
// 				raiders[raider].xpGained += 27000;
// 			}
// 		}
// 		else if (descriptionVar.includes('Better luck next time')) {
// 			raiders[raider].xpGained = 1000;
// 			raiders[raider].elixirGained = 20;
// 		}

// 		// Convert the updated JavaScript object back to a JSON string
// 		const updatedData = JSON.stringify(raiders, null, 2);

// 		// Write the JSON string back to the raiders.json file
// 		fs.writeFile('./storeroom/raiders.json', updatedData, 'utf8', (err) => {
// 			if (err) {
// 				console.error('Error writing to raiders.json:', err);
// 				return;
// 			}

// 			console.log('New raider entry added successfully!');

// 		});

// 	});


// });

client.login(config.token);
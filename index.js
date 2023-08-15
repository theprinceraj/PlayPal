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
const { time } = require('node:console');
const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		GatewayIntentBits.Guilds,
	],
});


client.on('ready', () => {
	console.log(`${convertTimestampToIST(Date.now())}: ${client.user.tag} is serving in ${client.guilds.cache.size} servers.`);
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
				})
				.catch(error => `Failed to create thread for ${newMessage.url}`);
		}
	} catch (error) { }
});

// Using json file as database
/*client.on('messageCreate', message => {
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

		let raiders = JSON.parse(data);

		const raider = message?.mentions?.users.first()?.id || descriptionVar.match(/<@(\d+)>/)[1];

		if (!raiders.hasOwnProperty(raider)) {
			raiders[raider] = {
				raids: {
					total: 0,
					won: 0,
					lost: 0
				},
				elixirGained: 0,
				xp: {
					total: 0,
					highest: 0,
					lowest: 0,
					lastRaid: 0,
					last5Raids: ["None", "None", "None", "None", "None"]
				}
			}

			raiders[raider].xp.highest = xpGained;
			console.log(`${convertTimestampToIST(message.createdTimestamp)}: NEW raider(${raider}) from server(${message.guildId}) was added!`);
		}

		raiders[raider].raids.total += 1;
		raiders[raider].xp.total += xpGained;
		raiders[raider].xp.lastRaid = xpGained;

		if (raiders[raider].xp.highest < xpGained)
			raiders[raider].xp.highest = xpGained;

		if (raiders[raider].xp.lowest > xpGained || raiders[raider].xp.lowest === 0)
			raiders[raider].xp.lowest = xpGained;

		if (descriptionVar.includes('Great job defeating the monster')) {
			raiders[raider].raids.won += 1;
			if (descriptionVar.includes('\nDifficulty: **Easy**')) {
				raiders[raider].xp.last5Raids.push(`Easy Win(XP = ${xpGained})`);
				raiders[raider].elixirGained += 80;
			}
			else if (descriptionVar.includes('\nDifficulty: **Medium**')) {
				raiders[raider].xp.last5Raids.push(`Medium Win(XP = ${xpGained})`);
				raiders[raider].elixirGained += 110;
			}
			else if (descriptionVar.includes('\nDifficulty: **Hard**')) {
				raiders[raider].xp.last5Raids.push(`Hard Win(XP = ${xpGained})`);
				raiders[raider].elixirGained += 170;
			}
		}
		else if (descriptionVar.includes('Better luck next time')) {
			raiders[raider].xp.last5Raids.push(`Lost(XP = ${xpGained})`);
			raiders[raider].raids.lost += 1;
			raiders[raider].elixirGained += 20;
		}
		raiders[raider].xp.last5Raids = raiders[raider].xp.last5Raids.slice(-5);

		// Convert the updated JavaScript object back to a JSON string
		const updatedData = JSON.stringify(raiders, null, 2);

		// Write the JSON string back to the raiders.json file
		fs.writeFile('./storeroom/raiders.json', updatedData, 'utf8', (err) => {
			if (err) {
				console.error('Error writing to raiders.json:', err);
				return;
			}
			// logs confirmation for data being updated
			console.log(`${convertTimestampToIST(message.createdTimestamp)}: Raider(${raider}) from server(${message.guildId}) was updated!`);
		});

	});

});*/


// Using firebase
const firebase = require('./firebase.js');
client.on('messageCreate', message => {
	if (message.author.id === '853629533855809596') return;
	// if (!['853629533855809596', '235148962103951360'].includes(message.author.id)) return;
	const descriptionVar = message.embeds[0]?.description;

	if (!descriptionVar || descriptionVar?.includes('Difficulty') === false || descriptionVar?.includes('Reroll Scrolls')) return;

	const xpRegex = /\+\d+/;
	const matchXp = descriptionVar.match(xpRegex);
	if (!matchXp) return;
	const xpGained = parseInt(matchXp[0].slice(1));

	// Fetching user mentioned from the raid result embed
	const raider = message?.mentions?.users.first()?.id || descriptionVar.match(/<@(\d+)>/)[1];

	const raidersRef = firebase.database().ref('raiders');
	raidersRef.child(raider).once('value', (snapshot) => {
		let raiderData = snapshot.val();
		if (!raiderData) {

			// Create new raider
			raiderData = {
				raids: {
					total: 0,
					won: 0,
					lost: 0
				},
				elixirGained: 0,
				xp: {
					total: 0,
					highest: 0,
					lowest: 0,
					lastRaid: 0,
					last5Raids: ["None", "None", "None", "None", "None"]
				}
			};
			raiderData.xp.highest = xpGained;

			// Logs confirmation for new raider addition
			console.log(`${convertTimestampToIST(message.createdTimestamp)}: NEW raider(${raider}) from server(${message.guildId}) was added!`);
		}

		raiderData.raids.total += 1;
		raiderData.xp.total += xpGained;
		raiderData.xp.lastRaid = xpGained;

		if (raiderData.xp.highest < xpGained)
			raiderData.xp.highest = xpGained;

		if (raiderData.xp.lowest > xpGained || raiderData.xp.lowest === 0)
			raiderData.xp.lowest = xpGained;

		if (descriptionVar.includes('Great job defeating the monster')) {
			raiderData.raids.won += 1;
			if (descriptionVar.includes('\nDifficulty: **Easy**')) {
				raiderData.xp.last5Raids.push(`Easy Win(XP = ${xpGained})`);
				raiderData.elixirGained += 80;
			}
			else if (descriptionVar.includes('\nDifficulty: **Medium**')) {
				raiderData.xp.last5Raids.push(`Medium Win(XP = ${xpGained})`);
				raiderData.elixirGained += 110;
			}
			else if (descriptionVar.includes('\nDifficulty: **Hard**')) {
				raiderData.xp.last5Raids.push(`Hard Win(XP = ${xpGained})`);
				raiderData.elixirGained += 170;
			}
		}
		else if (descriptionVar.includes('Better luck next time')) {
			raiderData.xp.last5Raids.push(`Lost(XP = ${xpGained})`);
			raiderData.raids.lost += 1;
			raiderData.elixirGained += 20;
		}
		raiderData.xp.last5Raids = raiderData.xp.last5Raids.slice(-5);

		// Update Firebase with the modified data
		raidersRef.child(raider).set(raiderData, (error) => {
			if (error) {
				console.error('\nError writing to Firebase:', error);
				return;
			}

			// logs confirmation that data has been updated
			console.log(`${convertTimestampToIST(message.createdTimestamp)}: Raider(${raider}) from server(${message.guildId}) was updated with [netElixir:${raiderData.elixirGained}, xpGained:${xpGained}]!`);
		});
	});


});

function convertTimestampToIST(timestamp) {
	const date = new Date(timestamp);
	const options = {
		timeZone: 'Asia/Kolkata',
		hour12: false,
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};
	const timeString = date.toLocaleTimeString('en-IN', options);
	return `${timeString} IST`;
}

client.login(client.config.token);
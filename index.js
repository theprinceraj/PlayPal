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


client.on('ready', () => {
	console.clear();
	client.user.setPresence({ activities: [{ name: 'JavaScript', type: ActivityType.Competing }] });
	console.log(`${convertTimestampToIST(Date.now())}: ${client.user.tag} is serving in ${client.guilds.cache.size} servers.`);
	setInterval(() => {
		console.log(`${convertTimestampToIST(Date.now())}: ${client.user.tag} is serving in ${client.guilds.cache.size} servers.`);
	}, 10 * 60 * 60 * 1000);
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
	console.log(`${folder}`);
	for (const file of commands) {
		const commandName = file.split('.')[0];
		const command = require(`./commands/${folder}/${file}`);
		if (command.aliases) {
			command.aliases.forEach(alias => {
				client.commands.set(alias, command);
			});
		}
		client.commands.set(commandName, command);
	}
}

client.on('messageCreate', tradeRequestMessage => {
	try {
		if (
			tradeRequestMessage.author.bot &&
			tradeRequestMessage.embeds[0].description.includes('sent a trade request') &&
			tradeRequestMessage.channel.id === '950783355614539778'
		) {
			tradeRequestMessage
				.startThread({
					name: `Send Crosstrade Proof:`,
					autoArchiveDuration: 24 * 60,
				})
				.then(thread => {
					thread.send('Please attach a screenshot proof to the above crosstrade here. It is a compulsory rule.');
				})
				.catch(error => `Failed to create thread for ${tradeRequestMessage.url}`);
		}
	} catch (error) { }
});

// Using firebase
const firebase = require('./firebase.js');
client.on('messageCreate', message => {
	if (message.author.id !== '853629533855809596') return;
	// if (!['853629533855809596', '235148962103951360'].includes(message.author.id)) return;
	const descriptionVar = message.embeds[0]?.description;

	if (message.embeds[0]?.title !== 'RAID: ENDED') return;
	if (!descriptionVar || descriptionVar?.includes('mock raid')) return;

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
					total: 0
				},
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

		raiderData.xp.last5Raids.push(`${xpGained}`);
		raiderData.xp.last5Raids = raiderData.xp.last5Raids.slice(1);

		// Update Firebase with the modified data
		raidersRef.child(raider).set(raiderData, (error) => {
			if (error) {
				console.error('\nError writing to Firebase:', error);
				return;
			}
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
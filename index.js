const fs = require("fs");

const config = require("./config.json");

const {
  Client,
  IntentsBitField,
  Collection,
  ActivityType,
  GatewayIntentBits,
} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    GatewayIntentBits.Guilds,
  ],
});

client.on("ready", () => {
  console.clear();
  client.user.setPresence({
    activities: [{ name: "JavaScript", type: ActivityType.Competing }],
  });
  console.log(
    `${convertTimestampToIST(Date.now())}: ${client.user.tag} is serving in ${
      client.guilds.cache.size
    } servers.`
  );
  setInterval(() => {
    console.log(
      `${convertTimestampToIST(Date.now())}: ${client.user.tag} is serving in ${
        client.guilds.cache.size
      } servers.`
    );
  }, 10 * 60 * 60 * 1000);
});

client.config = config;

const events = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));
for (const file of events) {
  const eventName = file.split(".")[0];
  const event = require(`./events/${file}`);
  client.on(eventName, event.bind(null, client));
}
client.commands = new Collection();
const commandsFolder = fs.readdirSync(`./commands`);
for (const folder of commandsFolder) {
  const commands = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  console.log(`${folder}`);
  for (const file of commands) {
    const commandName = file.split(".")[0];
    const extension = file.split(".")[1];

    const command = require(`./commands/${folder}/${file}`);
    if (command.aliases) {
      command.aliases.forEach((alias) => {
        client.commands.set(alias, command);
      });
    }
    client.commands.set(commandName, command);
    console.log(`Loaded ${commandName}`);
  }
}

client.on("messageCreate", async (verifyMsg) => {
  if (
    verifyMsg.channel.id !== "994660136230588648" ||
    !verifyMsg.author.bot ||
    verifyMsg.author.id !== "853629533855809596"
  ) {
    return;
  }
  const dropRegex = /`Dropped\s+`\s•\s`(\d{1,3}(,\d{3})*)/;
  const matchDrop = parseInt(
    verifyMsg.embeds[0].fields[1].value.match(dropRegex)[1].replace(",", "")
  );
  const grabRegex = /`Claimed\s+`\s•\s`(\d{1,3}(,\d{3})*)/;
  const matchGrab = parseInt(
    verifyMsg.embeds[0].fields[1].value.match(grabRegex)[1].replace(",", "")
  );
  const dailiesRegex = /`Dailies\s+`\s•\s`(\d{1,3}(,\d{3})*)/;
  const matchDailies = parseInt(
    verifyMsg.embeds[0].fields[1].value.match(dailiesRegex)[1].replace(",", "")
  );
  const votesRegex = /`Votes\s+`\s•\s`(\d{1,3}(,\d{3})*)/;
  const matchVotes = parseInt(
    verifyMsg.embeds[0].fields[1].value.match(votesRegex)[1].replace(",", "")
  );
  const _3dRegex = /`3D\s+`\s•\s`(\d{1,3}(,\d{3})*)/;
  const match3d = parseInt(
    verifyMsg.embeds[0].fields[1].value.match(_3dRegex)[1].replace(",", "")
  );
  const bumpsRegex = /`Bumps\s+`\s•\s`(\d{1,3}(,\d{3})*)/;
  const matchBumps = parseInt(
    verifyMsg.embeds[0].fields[1].value.match(bumpsRegex)[1]
  );

  const trustFactor = parseInt(
    verifyMsg.embeds[0].thumbnail.url.split("/")[4].split(".")[0]
  );

  if (
    !matchDrop ||
    !matchGrab ||
    !matchDailies ||
    !matchVotes ||
    !match3d ||
    !matchBumps ||
    !trustFactor
  ) {
    console.log(
      "Drops: " +
        matchDrop +
        "\nGrabs: " +
        matchGrab +
        "\nDailies: " +
        matchDailies +
        "\nVotes: " +
        matchVotes +
        "\n3Ds: " +
        match3d +
        "\nBumps: " +
        matchBumps +
        "\nTrust Factor: " +
        trustFactor
    );
    return;
  }
  const gloryA_Role = verifyMsg.guild.roles.cache.get("896663100340723762");
  const verificationRole =
    verifyMsg.guild.roles.cache.get("994659663826124910");
  const mentionedUser = verifyMsg.mentions.members.first();
  if (
    matchDrop >= 1500 &&
    matchGrab >= 1000 &&
    matchDailies >= 50 &&
    matchVotes >= 60 &&
    match3d >= 3 &&
    matchBumps >= 150 &&
    trustFactor >= 40 &&
    mentionedUser.roles.cache.has(gloryA_Role.id)
  ) {
    await verifyMsg.react("✅");
    if (mentionedUser.roles.cache.has(verificationRole.id)) {
      await verifyMsg.reply("You have already been verified! 😎");
      return;
    }
    await mentionedUser.roles.add(verificationRole);
    await verifyMsg.reply(
      "Congratulations, you have been verified! You can now send messages in <#940238806316105758>, <#959829877522042981> and <#896428196873011210>. 🎉"
    );
  } else {
    await verifyMsg.react("❌");
    await verifyMsg.reply(
      "Sorry, you are not eligible for verification yet. 😔\nPlease recheck if you fulfill the following requirements:\n```js\n1. Drops >= 1500, 2. Grabs >= 1000, 3. Dailies >= 50, 4. Votes >= 60\n5. 3D >= 3, 6. Bumps >= 150, 7. Trust Factor >= 40, 8. Has Chat Level 10 in server\n```\nYou can ask your queries in <#918693551133569065>."
    );
    if (mentionedUser.roles.cache.has(verificationRole.id))
      await mentionedUser.roles.remove(verificationRole);
  }
});
// Using firebase
const firebase = require("./firebase.js");
client.on("messageCreate", (message) => {
  if (message.author.id !== "853629533855809596") return;
  // if (!['853629533855809596', '235148962103951360'].includes(message.author.id)) return;
  const descriptionVar = message.embeds[0]?.description;

  if (message.embeds[0]?.title !== "RAID: ENDED") return;
  if (!descriptionVar || descriptionVar?.includes("mock raid")) return;

  const scoreRegex = /\*\d+/;
  const matchScore = descriptionVar.match(scoreRegex);
  if (!matchScore) return;
  const scoreGained = parseInt(matchScore[0].slice(1));

  // Fetching user mentioned from the raid result embed
  const raider =
    message?.mentions?.users.first()?.id || descriptionVar.match(/<@(\d+)>/)[1];

  const raidersRef = firebase.database().ref("raiders");
  raidersRef.child(raider).once("value", (snapshot) => {
    let raiderData = snapshot.val();
    if (!raiderData) {
      // Create new raider
      raiderData = {
        raids: {
          total: 0,
        },
        score: {
          total: 0,
          highest: 0,
          lowest: 0,
          lastRaid: 0,
          last5Raids: ["None", "None", "None", "None", "None"],
        },
      };
      raiderData.score.highest = scoreGained;

      // Logs confirmation for new raider addition
      console.log(
        `${convertTimestampToIST(
          message.createdTimestamp
        )}: NEW raider(${raider}) from server(${message.guildId}) was added!`
      );
    }

    raiderData.raids.total += 1;
    raiderData.score.total += scoreGained;
    raiderData.score.lastRaid = scoreGained;

    if (raiderData.score.highest < scoreGained)
      raiderData.score.highest = scoreGained;

    if (raiderData.score.lowest > scoreGained || raiderData.score.lowest === 0)
      raiderData.score.lowest = scoreGained;

    raiderData.score.last5Raids.push(`${scoreGained}`);
    raiderData.score.last5Raids = raiderData.score.last5Raids.slice(1);

    // Update Firebase with the modified data
    raidersRef.child(raider).set(raiderData, (error) => {
      if (error) {
        console.error("\nError writing to Firebase:", error);
        return;
      }
    });
  });
});

function convertTimestampToIST(timestamp) {
  const date = new Date(timestamp);
  const options = {
    timeZone: "Asia/Kolkata",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeString = date.toLocaleTimeString("en-IN", options);
  return `${timeString} IST`;
}

client.login(client.config.token);

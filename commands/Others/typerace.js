const { EmbedBuilder } = require('discord.js');
let gameStatus = false;

exports.run = async (client, message, args) => {
  let word,
    randomWordLength,
    randomWordCount,
    gameChannel,
    gameMessage,
    participants = [];
  randomWordLength = Math.floor(Math.random()*5)+3;
  randomWordCount = Math.floor(Math.random()*3)+1;
  if (!gameStatus) {
    const res = await fetch(`https://random-word-api.vercel.app/api?words=${randomWordCount}&length=${randomWordLength}`);
    const jsonOutput = await res.json();
    console.log(jsonOutput);
    const word = jsonOutput.join(' ');
    let embed = new EmbedBuilder()
      .setTitle("PlayPal's Type Race Game")
      .setDescription(`Who can type **__${word}__** before everyone else?`)
      .setColor(Math.floor(Math.random() * 16777215));

    gameMessage = await message.reply({ embeds: [embed] }).catch(error => console.error(error));
    gameChannel = message.channel;

    gameStatus = true;
    setTimeout(() => {
      gameStatus = false;
      embed.setDescription(
        `Who can type **__${word}__** before everyone else?\n\n**__Top fastest typists__:**\n${
          participants.length ? participants.slice(0, 10).join('\n') : 'No Winners'
        }`,
      );
      embed.setColor(Math.floor(Math.random() * 16777215));
      embed.setFooter({
        text: message.guild.name,
        iconURL: message.guild.iconURL(),
      });
      gameMessage.edit({ embeds: [embed] }).catch(console.error);
      participants = [];
    }, 10000);
    client.on('messageCreate', async messageWord => {
      if (
        messageWord.content.toLowerCase().startsWith(word) &&
        messageWord.channel === gameChannel &&
        gameStatus === true &&
        !messageWord.author.bot
      ) {
        let timeTaken = Math.abs((Date.now() - gameMessage.createdTimestamp) / 1000).toFixed(2);
        let wpm = (randomWordCount/timeTaken)*60;
        if (!participants.some(text => text.includes(messageWord.author.username))) {
          await messageWord.react('🍀');

          participants.push(`\`${timeTaken}s\` : \`${Math.floor(wpm)}wpm\` : **${messageWord.author.username}**`);
         
        }
        return;
      }
    });
  }
};

exports.name = 'typerace';
exports.aliases = ['cr', 'tr'];

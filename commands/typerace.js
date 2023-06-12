const { EmbedBuilder } = require('discord.js');
let gameStatus = false;

exports.run = async (client, message, args) => {
  let word,
    gameChannel,
    gameMessage,
    participants = [];

  if (!gameStatus) {
    const res = await fetch('https://random-word-api.vercel.app/api?words=1');
    word = await res.json();
    let embed = new EmbedBuilder()
      .setTitle("PlayPal's Type Race Game")
      .setDescription(`Who can type **__${word}__** before everyone else?`)
      .setColor(Math.floor(Math.random() * 16777215));

    gameMessage = await message.reply({ embeds: [embed] });
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
        if (!participants.some(text => text.includes(messageWord.author.username))) {
          await messageWord.react('🍀');

          participants.push(`\`${timeTaken}s\` : ${messageWord.author.username}`);
         
        }
        return;
      }
    });
  }
};

exports.name = 'typerace';
exports.aliases = ['cr', 'tr'];

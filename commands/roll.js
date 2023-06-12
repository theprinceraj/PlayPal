const { EmbedBuilder } = require('discord.js');
exports.run = (client, message, args) => {
    let roll = Math.floor(Math.random()*100) + 1;
    const embed = new EmbedBuilder()
	embed.setColor("#000000")
	embed.setTitle("Dice Roll Result")
  	embed.setDescription(`${message.author.username} rolled **__${roll}__**`);
     
     message.reply({embeds: [embed]});
}

exports.name = "roll"
exports.aliases = ['dice']
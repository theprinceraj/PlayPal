const {EmbedBuilder} = require('discord.js');

exports.run = (client, message, args) => {
    const result = Math.floor(Math.random()*2);
    const embed = new EmbedBuilder()
    .setColor("#000000")
    .setDescription(`Coin was tossed by ${message.author.username} and the outcome is __**${result === 0 ? "Heads" : "Tails"}**__.`)
    if(result === 0) embed.setThumbnail('https://i.ibb.co/xfMnwWX/5bcdff016650de030e03ce81.png');
    else embed.setThumbnail('https://i.ibb.co/DLK3LDx/5bcdfeb96650de030e03ce7f.png');
    message.reply({embeds:[embed]}).catch(error => console.error(error));
}

exports.name = "flip"
exports.aliases = ["coin"]
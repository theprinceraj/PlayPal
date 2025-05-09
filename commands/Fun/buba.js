const { EmbedBuilder } = require('discord.js');

exports.run = (client, message, args) => {
    try {
        const user = message.mentions.users.first() || message.author;
        if (!user) return;
        const bubaComments = [
            "${user} has so small booba that its not even visible through microscope.",
            "${user} is a no booba person.",
            "${user} has decent sized booba.",
            "${user} has so large boobas that they cannot walk, OMG!",
            "${user} has as large booba as Daksh's ass.",
            "${user} had no boobaa initially but they went through gender transplant and now have developed some!"
        ];
        const response = bubaComments[Math.floor(Math.random() * bubaComments.length)].replace("${user}", user);
        const embed = new EmbedBuilder()
            .setTitle(`${client.user.username}'s Buba Predictor`)
            .setDescription(`${response}`)
            .setTimestamp()
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
        message.reply({ embeds: [embed] }).catch(error => logError(error))
    } catch (e) {
        console.log(e)
        // logError(e);
    }

}

exports.name = "buba";
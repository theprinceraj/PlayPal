const { EmbedBuilder } = require('discord.js');

exports.run = (client, message, args) => {
    const embed = new EmbedBuilder()
        .setTitle("PlayPal's Invite Link")
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`> **__${message.author.username}__**, click [here](https://discord.com/api/oauth2/authorize?client_id=1104277580577783848&permissions=395137371201&scope=bot) to invite me.\n`)
    if (message.guild)
        embed.setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })

    message.reply({ embeds: [embed] }).catch(error => console.error(error));
}

exports.name = "invite";
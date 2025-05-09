const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    const TENOR_API_KEY = client.config.TENOR_API_TOKEN;
    const user = message.mentions?.users.first() || message.author;
    const msg = user !== message.author ? `${randomSlapMessage(user)}` : `Bro chose to slap himself😂`;
    const query = "Funny slap";
    const response = await fetch(`https://tenor.googleapis.com/v2/search?q=${query}&key=${TENOR_API_KEY}&limit=1&contentfilter=high&random=true`);
    const json = await response.json();

    const replyEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setDescription(msg)
        .setImage(json.results[0].media_formats.gif.url);

    message.reply({ embeds: [replyEmbed] }).catch(e => console.error(e));
}

exports.name = 'slap';

function randomSlapMessage(targetUser) {
    const funnyMsgs = [
        `You slap the pixels out of ${targetUser}! Ouch, digital pain!`,
        `Your slap reverberates across servers. You're the slap-master!`,
        `Slapping in progress... Warning: May cause laughter!`,
        `You slap ${targetUser} so hard, their emoji collection falls out!`,
        `Slap mode activated! Kapow!`,
        `Your slap has been delivered via high-speed internet. Bam!`,
        `Slapping is just a digital way of saying 'You're special'.`,
        `You slapped ${targetUser} with such finesse, they got a virtual handprint!`,
        `Congratulations! You've unlocked the 'Slap-tastic' achievement!`,
        `Slap initiated. Error 404: Sense of humor not found!`
    ];
    const randomArrIndex = Math.round(Math.random() * funnyMsgs.length);
    return funnyMsgs[randomArrIndex];
}
const { EmbedBuilder } = require('discord.js');
const config = require("../../config.json");

const online_emoji = "<a:online:1115694948306661457>";
const ping_emoji = "<a:ping:1115687484706271394>";
const crown_emoji = "<a:crown:1115697710503313408>";
const uptime_emoji = "<a:uptime:1115700825013092362>";
const memory_emoji = "<:memory:1115841773726597270>";
const servers_emoji = "<:servers:1115844486698893403>";

function formatDuration(durationInSeconds){
    const days = Math.floor(durationInSeconds/86400);
    const hours = Math.floor((durationInSeconds%86400)/3600);
    const mins = Math.floor(((durationInSeconds%86400)%3600)/60);
    const seconds = ((durationInSeconds%86400)%3600)%60;
    const formattedTime = days+"d "+hours+"h "+mins+"m "+seconds+"s"
    return formattedTime;
}

exports.run = (client, message, args) => {
    if(message.author.id !== "564327207133249536"){
        message.reply(`Only \`Bhaalu#1337\` can use this command.`);
        return;
    }

    
    const prefix = config.prefix;
    const avatar = client.user.displayAvatarURL();
    const ping = Date.now() - message.createdTimestamp;
    const uptime = formatDuration((Date.now() - client.readyTimestamp)/1000);
    const usedMemory = Math.round((process.memoryUsage().heapUsed / 1024 / 1024)*100)/100+"MB";
    const serverNamesWithoutSpace = client.guilds.cache.map((server) => {
        return server.name;
    })
    const serverNamesWithSpace = serverNamesWithoutSpace.join(', ');
    

    
  
    const embed = new EmbedBuilder()
    .setTitle(`${client.user.tag}'s Information`)
    .setThumbnail(avatar)
    .setDescription(`${online_emoji} I am serving \`${client.guilds.cache.size}\` servers with prefix \`${prefix}\`! ❤️🚀\n${crown_emoji} **Developer**: ${message.author.tag}\n${ping_emoji} **Ping**: \`${ping}ms\`\n${uptime_emoji} **Uptime**: \`${uptime}\`\n${memory_emoji} **Memory Usage**: \`${usedMemory}\`\n${servers_emoji} **Server List**: ||${serverNamesWithSpace}||`)
    .setTimestamp();
    
    message.reply({embeds: [embed]});
    
}


exports.name = "botinfo";
exports.aliases = ["bi", "ping"]
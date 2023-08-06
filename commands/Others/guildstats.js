const { EmbedBuilder } = require('discord.js');
const fs = require('fs');


exports.run = (client, message, args) => {
    if (args.length === 0) {
        message.reply(`Correct format: \`!!gs user-id\\mention\\name\``).catch(error => {
            console.log(error);
        })
        return;
    }
    fs.readFile('./storeroom/raiders.json', 'utf8', async (err, data) => {
        if (err) {
            console.log('Error reading the file raiders.json in guildstats.js' + '/n' + err)
            return;
        }

        const raiders = JSON.parse(data);
        try {
            let raiderSearched = message.mentions.users.first() || null;
            if (!raiderSearched && args.length > 0) {
                let input = args.join(' ')
                let temp = message.guild.members.cache.get(input) || message.guild.members.cache.find(mem => mem.user.username === input) || message.guild.members.cache.find(mem => mem.user.discriminator === input) || null
                if (temp) raiderSearched = temp.user;
            }


            if (!raiders.hasOwnProperty(raiderSearched.id)) {
                message.reply('No stat found, do a raid with `sgr` and then try again.')
            }
            const embed = new EmbedBuilder()
                .setTitle(`PlayPal's Guild Stats for ${raiderSearched.username}`)
                .setDescription(`Raids Done: ${raiders[raiderSearched.id].raidsDone}\nXP Gained:${raiders[raiderSearched.id].xpGained}\nElixir Gained: ${raiders[raiderSearched.id].elixirGained}`)

            message.reply({ embeds: [embed] }).catch(err => console.log(err))
        } catch (error) { }

    });
}

exports.name = 'guildstats';
exports.aliases = ['gs'];
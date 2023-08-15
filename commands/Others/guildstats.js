const { EmbedBuilder } = require('discord.js');
const fs = require('fs');


exports.run = (client, message, args) => {
    try {
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
                    let input = args.join(' '), temp;
                    if (message.author.id !== '564327207133249536') {
                        temp = message.guild.members.cache.get(input) || message.guild.members.cache.find(mem => mem.user.username === input) || null
                    } else {
                        temp = client.users.cache.get(input) || client.users.cache.find(mem => mem.username === input) || undefined
                    }
                    if (temp) raiderSearched = temp;
                    else {
                        message.reply(`No user found for \`${input}\``).catch(err => console.log(err))
                        return;
                    }
                }


                if (!raiders.hasOwnProperty(raiderSearched.id)) {
                    message.reply('No stat found, do a raid with `sgr` and then try again.').catch(err => console.log(err))
                }
                const embed = new EmbedBuilder()
                    .setColor('#6666ff')
                    .setTitle(`**Raider Stats for \`${raiderSearched.username}\`**`)
                    .setThumbnail(raiderSearched.displayAvatarURL())
                    .addFields(
                        { name: '⚔️ Raids', value: `Total: \`${raiders[raiderSearched.id].raids.total}\`\nWins: \`${raiders[raiderSearched.id].raids.won}\`\nLosses: \`${raiders[raiderSearched.id].raids.lost}\`` },
                        { name: '<:elixir_icon:1138401766216577044> Elixirs', value: `Total: \`${raiders[raiderSearched.id].elixirGained}\`` },
                        { name: '🎓 XP', value: `Total: \`${raiders[raiderSearched.id].xp.total}\`\nHighest: \`${raiders[raiderSearched.id].xp.highest}\`\nLowest: \`${raiders[raiderSearched.id].xp.lowest}\`\nLast Raid: \`${raiders[raiderSearched.id].xp.lastRaid}\`\nAverage: \`${Math.round(raiders[raiderSearched.id].xp.total / raiders[raiderSearched.id].raids.total)}\`\nLast 5 Raids: \`${raiders[raiderSearched.id].xp.last5Raids.join(', ')}\`` },
                        { name: '<a:rocket_emoji:1141006841132879872> Add Me', value: `[Click here](https://discord.com/api/oauth2/authorize?client_id=1104277580577783848&permissions=395137371201&scope=bot)` }
                    )
                    .setTimestamp()
                    .setFooter({ text: "Report 🐛 to @bhaalu, if any", iconURL: 'https://i.ibb.co/44pnNp5/IMG-20230419-004628.jpg' })

                message.reply({ content: 'Grace period for the guild season ends <t:1692136800:R>. The raid stats for everyone(in PlayPal) will be reset <t:1692124260:R>. Message @bhaalu if you have any queries.', embeds: [embed] }).catch(err => console.log(err))
                // message.reply({ embeds: [embed] }).catch(err => console.log(err))
            } catch (error) { }

        });
    } catch (e) {
        console.log(e);
    }
}

exports.name = 'guildstats';
exports.aliases = ['gs'];
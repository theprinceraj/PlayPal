const { EmbedBuilder } = require('discord.js');
const firebase = require('../../firebase.js');

exports.run = (client, message, args) => {
    try {
        if (args.length === 0) {
            message.reply(`Correct format: \`!!gs user-id\\mention\\name\``).catch(error => {
                console.log(error);
            })
            return;
        }

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
                message.reply(`No discord user found for \`${input}\``).catch(err => console.log(err))
                return;
            }
        }

        const raidersRef = firebase.database().ref('raiders');
        raidersRef.child(raiderSearched.id).once('value', (snapshot) => {
            const raiderData = snapshot.val();
            if (!raiderData) {
                message.reply('No stat found, do a raid with `sgr` and then try again.').catch(err => console.log(err));
                return;
            }

            // Make embed for displaying stats
            const statsDisplayEmbed = new EmbedBuilder()
                .setTitle(`**Raider Stats for \`${raiderSearched.username}\`**`)
                .setThumbnail(raiderSearched.displayAvatarURL())
                .setColor('#6666ff')
                .setFooter({ text: "Report 🐛 to @bhaalu, if any", iconURL: 'https://i.ibb.co/44pnNp5/IMG-20230419-004628.jpg' })
                .setTimestamp()
                .addFields(
                    { name: '⚔️ Raids', value: `Total: \`${raiderData.raids.total}\`\nWins: \`${raiderData.raids.won}\`\nLosses: \`${raiderData.raids.lost}\`` },
                    { name: '<:elixir_icon:1138401766216577044> Elixirs', value: `Total: \`${raiderData.elixirGained}\`` },
                    { name: '<:mathsymbol:1137801859772461116> XP', value: `Total: \`${raiderData.xp.total}\`\nHighest: \`${raiderData.xp.highest}\`\nLowest: \`${raiderData.xp.lowest}\`\nLast Raid: \`${raiderData.xp.lastRaid}\`\nAverage: \`${Math.round(raiderData.xp.total / raiderData.raids.total)}\`\nLast 5 Raids: \`${raiderData.xp.last5Raids.join(', ')}\`` },
                    { name: '✨ Add Me', value: `[Click here](https://discord.com/api/oauth2/authorize?client_id=1104277580577783848&permissions=395137371201&scope=bot)` }
                )

            message.reply({ embeds: [statsDisplayEmbed] }).catch(err => console.log(err))
        })

    } catch (e) {
        console.log(e);
    }
}

exports.name = 'guildstats';
exports.aliases = ['gs'];
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const firebase = require('../../firebase.js');

function convertArrayToString(arr) {
    let result = '';

    for (let i = 0; i < arr.length; i++) {
        const raiderKey = arr[i].raiderId;
        result += `${i + 1}. \`${raiderKey}\`\n`;
    }

    return result.trim();
}

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
        raidersRef.child(raiderSearched.id).once('value', async (snapshot) => {
            const raiderData = snapshot.val();

            if (!raiderData) {
                message.reply('No stat found, do a raid with `sgr` and then try again.').catch(err => console.log(err));
                return;
            }

            // Make embed for displaying stats
            let statsDisplayEmbed = new EmbedBuilder()
                .setTitle(`**Raider Stats for \`${raiderSearched.username}\`**`)
                .setThumbnail(raiderSearched.displayAvatarURL())
                .setColor('#6666ff')
                .setFooter({ text: "Report 🐛 to @bhaalu, if any", iconURL: 'https://i.ibb.co/44pnNp5/IMG-20230419-004628.jpg' })
                .setTimestamp()
                .addFields(
                    { name: '⚔️ Raids', value: `Total: \`${raiderData.raids.total}\`` },
                    { name: '🎓 Score', value: `Total: \`${raiderData.score.total}\`\nHighest: \`${raiderData.score.highest}\`\nLowest: \`${raiderData.score.lowest}\`\nLast Raid: \`${raiderData.score.lastRaid}\`\nAverage: \`${Math.round(raiderData.score.total / raiderData.raids.total)}\`\nLast 5 Raids: \`${raiderData.score.last5Raids.join(', ')}\`` },
                    { name: '<a:rocket_emoji:1141006841132879872> Join my support server to report issues or bugs or downtimes', value: `[Click here](https://discord.gg/SxwEffMWch)` }
                )
                
            const websiteViewButton = new ButtonBuilder()
                .setLabel('View On Website')
                .setURL(`https://playpal-sigma.vercel.app/api/search?userId=${raiderSearched.id}`)
                .setStyle(ButtonStyle.Link);
            const row = new ActionRowBuilder()
                .addComponents(websiteViewButton);

            message.reply({ content: '', embeds: [statsDisplayEmbed], components: [row] }).catch(err => console.log(err));

        })

    } catch (e) {
        console.log(e);
    }
}

exports.name = 'guildstats';
exports.aliases = ['gs'];
const { EmbedBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
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
                    { name: '⚔️ Raids', value: `Total: \`${raiderData.raids.total}\`\nWins: \`${raiderData.raids.won}\`\nLosses: \`${raiderData.raids.lost}\`` },
                    { name: '<:elixir_icon:1138401766216577044> Elixirs', value: `Total: \`${raiderData.elixirGained}\`` },
                    { name: '🎓 XP', value: `Total: \`${raiderData.xp.total}\`\nHighest: \`${raiderData.xp.highest}\`\nLowest: \`${raiderData.xp.lowest}\`\nLast Raid: \`${raiderData.xp.lastRaid}\`\nAverage: \`${Math.round(raiderData.xp.total / raiderData.raids.total)}\`\nLast 5 Raids: \`${raiderData.xp.last5Raids.join(', ')}\`` },
                    { name: '<a:rocket_emoji:1141006841132879872> Add Me', value: `[Click here](https://discord.com/api/oauth2/authorize?client_id=1104277580577783848&permissions=395137371201&scope=bot)` }
                )

            if (message.author.id === '564327207133249536') {
                // Make a select menu
                const select = new StringSelectMenuBuilder()
                    .setCustomId('guild-stats-dropdown')
                    .setPlaceholder('Make a selection!')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Ascending Order')
                            .setDescription('Sorts people in ascending order of their XP.')
                            .setValue('ascending')
                            .setEmoji('↗️'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Descending Order')
                            .setDescription('Sorts people in ascending order of their XP.')
                            .setValue('descending')
                            .setEmoji('↘️'),
                    );
                const actionRow = new ActionRowBuilder()
                    .addComponents(select)

                let initialMessage = await message.reply({ embeds: [statsDisplayEmbed], components: [actionRow] }).catch(err => console.log(err))

                client.on('interactionCreate', async (interaction) => {
                    if (!interaction.isStringSelectMenu() || interaction.customId !== 'guild-stats-dropdown') return;
                    let arrayOfRaiders = [];
                    const raidersDatabase = await raidersRef.once('value')
                    raidersDatabase.forEach(raiderEntry => {
                        let raiderId = raiderEntry.key;
                        let raiderDetails = raiderEntry.val();
                        arrayOfRaiders.push({ raiderId: raiderId, totalXp: raiderDetails.xp.total })
                    })
                    let sortedArray = [];
                    if (interaction.values[0] === 'ascending') {
                        sortedArray = arrayOfRaiders.sort((a, b) => a.totalXp - b.totalXp)
                    } else if (interaction.values[0] === 'descending') {
                        sortedArray = arrayOfRaiders.sort((a, b) => b.totalXp - a.totalXp)
                    }

                    let trimmedArrayOfRaiders = sortedArray.slice(0,6);

                    // Remove fields from the embed
                    [0, 1, 2].forEach(index => {
                        statsDisplayEmbed.spliceFields(index, 1);
                    });
                    statsDisplayEmbed.setTitle('Overall Stats')
                    statsDisplayEmbed.setDescription(convertArrayToString(trimmedArrayOfRaiders))

                    initialMessage.edit({ embeds: [statsDisplayEmbed], components: [actionRow] }).catch(e => {})
                });
            } else {
                // message.reply({ content: 'Grace period for the guild season ends <t:1692210540:R>. The raid stats for everyone(in PlayPal) will be reset <t:1692206940:R>. Message @bhaalu if you have any queries.', embeds: [statsDisplayEmbed] }).catch(err => console.log(err))
                message.reply({ embeds: [statsDisplayEmbed] }).catch(err => console.log(err))
            }
        })

    } catch (e) {
        console.log(e);
    }
}

exports.name = 'guildstats';
exports.aliases = ['gs'];
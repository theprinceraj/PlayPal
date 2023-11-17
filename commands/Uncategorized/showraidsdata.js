const firebase = require('../../firebase.js');
const fs = require('fs');
const path = require('node:path');
const { AttachmentBuilder } = require('discord.js')

exports.run = async (client, message, args) => {
    if ([!'564327207133249536'].includes(message.author.id)) return;

    let array = [];

    try {
        const snapshot = await firebase.database().ref('raiders').once('value');

        snapshot.forEach(childSnapshot => {
            const raiderKey = childSnapshot.key;
            const raiderData = childSnapshot.val();

            array.push(`Raider ID: ${raiderKey}\nElixir Gained:${raiderData.elixirGained}\nRaids Lost: ${raiderData.raids.lost}\nRaids Won: ${raiderData.raids.won}\nTotal Raids: ${raiderData.raids.total}\nTotal XP: ${raiderData.xp.total}\nHighest XP: ${raiderData.xp.highest}\nLowest XP: ${raiderData.xp.lowest}\nMost Recent Raid XP: ${raiderData.xp.lastRaid}`);

        });
        array.unshift(`Guild Stats`);
        const finalFileText = array.join(`\n\n===========================================\n\n`)

        fs.writeFile(`storeroom/Guild_Stats.txt`, finalFileText, 'utf8', err => { })

        const att = new AttachmentBuilder(path.join('storeroom', 'Guild_Stats.txt'), 'Guild_Stats.txt');
        message.reply({ content: ``, files: [att] }).catch(error => console.error(error));

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

exports.name = 'showraidsdata';
exports.aliases = ['srd'];
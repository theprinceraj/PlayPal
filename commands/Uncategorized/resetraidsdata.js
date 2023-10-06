const firebase = require('../../firebase.js');
const fs = require('fs');
const path = require('node:path');
const { AttachmentBuilder } = require('discord.js')

exports.run = async (client, message, args) => {
    try {
        if (!['564327207133249536', '710735290993737759'].includes(message.author.id)) {
            message.reply(`Only highly qualified royal people can use this command. ||just kidding, don't mind ;)||`).catch(console.error);
            return;
        }

        let array = [];
        const snapshot = await firebase.database().ref('raiders').once('value');
        snapshot.forEach(childSnapshot => {
            const raiderKey = childSnapshot.key;
            const raiderData = childSnapshot.val();

            array.push(`Raider ID: ${raiderKey}\nElixir Gained:${raiderData.elixirGained}\nRaids Lost: ${raiderData.raids.lost}\nRaids Won: ${raiderData.raids.won}\nTotal Raids: ${raiderData.raids.total}\nTotal XP: ${raiderData.xp.total}\nHighest XP: ${raiderData.xp.highest}\nLowest XP: ${raiderData.xp.lowest}\nMost Recent Raid XP: ${raiderData.xp.lastRaid}`);

        });
        array.unshift(`Guild Stats - October First Season`);
        const finalFileText = array.join(`\n\n===========================================\n\n`)

        fs.writeFile(`storeroom/Guild_Stats_October_1st_Season.txt`, finalFileText, 'utf8', err => { })


        snapshot.ref.remove();

        console.log(`====================\nRAID DATA WAS RESET BY ${message.author.username}\n====================`);
        message.reply('Raid data has been reset!').catch(console.error);
    } catch { }
}

exports.name = 'resetraidsdata'
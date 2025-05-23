const firebase = require('../../firebase.js');
const fs = require('fs');
const { AttachmentBuilder } = require('discord.js');

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

            array.push(`Raider ID: ${raiderKey}\nTotal Raids: ${raiderData.raids.total}\nTotal Score: ${raiderData.score.total}\nHighest Score: ${raiderData.score.highest}\nLowest Score: ${raiderData.score.lowest}\nMost Recent Raid Score: ${raiderData.score.lastRaid}`);

        });
        array.unshift(`Guild Stats`);
        const finalFileText = array.join(`\n\n===========================================\n\n`)

        fs.writeFile(`storeroom/Guild_Stats.txt`, finalFileText, 'utf8', err => { });
        snapshot.ref.remove();

        const att = new AttachmentBuilder(path.join('storeroom', 'Guild_Stats.txt'), 'Guild_Stats.txt');

        console.log(`====================\nRAID DATA WAS RESET BY ${message.author.username}\n====================`);
        message.reply({ content: 'Raid data has been reset.', files: [att] }).catch(console.error);
        client.channels.cache.get(`1190393025994706944`).send({ content: `Current Season's Stats(Refer to the message date)`, files: [att] });
    } catch (err) { console.error(err) }
}

exports.name = 'resetraidsdata'
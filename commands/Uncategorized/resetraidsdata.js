const firebase = require('../../firebase.js');
const fs = require('fs');
const path = require('node:path');
const { AttachmentBuilder } = require('discord.js')

exports.run = async (client, message, args) => {
    if (!['564327207133249536', '710735290993737759'].includes(message.author.id)) return;

    const snapshot = await firebase.database().ref('raiders').once('value');
    snapshot.ref.remove();


    console.log(`\n\nRAID DATA WAS RESET BY ${message.author.username}\n\n`);

    message.reply('Raid data has been reset!').catch(console.error);
}

exports.name = 'resetraidsdata'
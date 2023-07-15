const { AttachmentBuilder } = require('discord.js');
const { Canvas,
      createCanvas,
      loadImage,
      GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const { join } = require('path');

exports.run = async (client, message, args) => {
    try {
        GlobalFonts.registerFromPath(join(__dirname,'gg sans Regular.ttf'),'gg_sans');
        const sentence = args.join(' ');
        if(sentence.length !== 0) {
            const baseImage = await loadImage(join(__dirname,'crySayBaseImage.png')).catch(err1 => {
                console.error('Error while loading the image.');
                return;
            });
           const canvas = await createCanvas(baseImage.width, baseImage.height); 
            const ctx = canvas.getContext('2d');
            ctx.drawImage(baseImage, 0, 0); //draws base image
            ctx.fillStyle = '#ffffff';
            ctx.font = '50px gg_sans';
            ctx.fillText(sentence, 216, 117); // writes person's message
            
            const pngFile = await canvas.encode('png');
            const attachment = new AttachmentBuilder(pngFile, 'Playpal.png');
            message.channel.send({
                content:"",
                files: [attachment],
            }).catch(err2 => {
                console.error('Error while sending the modified image');
                return;
            })
        }
    } catch(e){
        console.error(`\n\nError encountered inside crySay.js:\n${e}`);
        return;
    }
}

exports.name = 'crysay';
exports.aliases = ['cs'];

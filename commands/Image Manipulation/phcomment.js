const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas')
const { join } = require('path')
const { AttachmentBuilder } = require('discord.js')

exports.run = async (client, message, args) => {
    try {
        const member = message.mentions.members.first() || message.member;
        if (!member){
            message.reply('Correct format: `!!phcomment <@user> <message>`').catch(err1 => { })
            return;
        } 

        GlobalFonts.registerFromPath(join(__dirname, 'phCommentProps.ttf'), 'customFont');
        GlobalFonts.registerFromPath(join(__dirname, 'phCommentPropsBold.ttf'), 'customFontBold');

        const pingRegex = /^</
        if (pingRegex.test(args[0]))
            args.splice(0, 1);
        const sentence = args.join(' ');
        if (sentence.length > 40) {
            message.reply(`Your message exceeds 80 characters limit.`).catch(err1 => {
                console.error('Error while replying to the message.');
            })
            return;
        }
        if (sentence.length !== 0) {
            const baseImage = await loadImage(join(__dirname, 'phcommentProps.png')).catch(err1 => {
                console.error('Error while loading the image.');
                return;
            });
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(baseImage, 0, 0); //draws base image


            ctx.fillStyle = '#ef9535';
            ctx.font = '46px customFontBold';
            ctx.fillText(member.displayName, 189, 1640); // writes person's name

            ctx.fillStyle = '#ffffff';
            ctx.font = '40px customFont';
            ctx.fillText(sentence, 160, 1722); // writes person's message

            ctx.beginPath();  // Pick up the pen      
            ctx.arc(77, 1647, 60, 0, Math.PI * 2);  // Start the arc to form a circle
            ctx.closePath();  // Put the pen down
            ctx.clip(); // Clip off the region you drew on
            // draw image of message author on the canvas
            const memberAvatar = await loadImage(member.displayAvatarURL());
            ctx.drawImage(memberAvatar, 17, 1586, 120, 120);

            const pngFile = await canvas.encode('png');
            const attachment = new AttachmentBuilder(pngFile, 'Playpal.png');
            message.channel.send({
                content: "",
                files: [attachment],
            }).catch(err2 => {
                console.error('Error while sending the modified image');
                return;
            })
        }
    } catch (e) {
        console.error(`\n\nError encountered inside phcomment.js:\n${e}`);
        return;
    }
}

exports.name = 'phcomment';
exports.aliases = ['phc'];
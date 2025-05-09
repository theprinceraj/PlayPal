const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas')
const { join } = require('path')
const { AttachmentBuilder } = require('discord.js')

exports.run = async (client, message, args) => {
    try {
        const member = message.mentions.members.first() || message.author;
        if (!member) {
            message.reply('Correct format: `!!groupphoto <@user>`').catch(err1 => { })
            return;
        }
        GlobalFonts.registerFromPath(join(__dirname, 'instagramFont.ttf'), 'igFont');

        const image = await loadImage(join(__dirname, 'groupPhotoProps.jpg'))
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0);

        const avatar = await loadImage(member.displayAvatarURL())
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath()
        ctx.arc(620, 356, 95, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(avatar, 517, 255, 205, 205);

        const jpgFile = await canvas.encode('jpeg');
        const attachment = new AttachmentBuilder(jpgFile, 'modified_image.jpg')
        message.channel.send({
            content: '',
            files: [attachment]
        }).catch((e) => {
            console.log(e);
        })
    } catch (e1) {
        console.log(e1);
    }


}

exports.name = 'groupphoto'
exports.aliases = ['gp']

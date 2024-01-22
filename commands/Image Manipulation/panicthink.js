const { Canvas, loadImage, registerFont } = require('canvas-constructor/napi-rs');
const { join } = require('path');

registerFont(join(__dirname, 'phCommentProps.ttf'), 'customFont');

exports.run = async (client, message, args) => {
    const msg = args.join(' ');
    if (!msg) return message.reply('Please enter a message.').catch(e => { })

    if (msg.length > 22) return message.reply('Please enter a message shorter than 22 characters length.').catch(e => { });

    const imageProp = await loadImage(join(__dirname, 'panicThinkProps.png'));
    const imageCanvas = new Canvas(512, 512)
        .printImage(imageProp, 0, 0)
        .setTextAlign('center')
        .setTextFont('25px customFont')
        .printText(msg, 325, 158)
        .png();

    message.reply({
        content: '',
        files: [imageCanvas]
    }).catch(e => { });
}

exports.name = 'panicthink';
exports.aliases = ['pt', 'pthink'];
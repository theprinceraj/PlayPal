const {
  Canvas,
  createCanvas,
  loadImage, GlobalFonts
} = require('@napi-rs/canvas')
const {
  AttachmentBuilder
} = require('discord.js');
const fs = require('fs');
const { join } = require('path')

exports.run = async (client, message, args0) => {
  try {
    const member = message.mentions.members.first() || message.member;
    if (!member) return;
    const roleList = member.roles.cache;
    const topRole = roleList.first().id;


    GlobalFonts.registerFromPath(join(__dirname, 'gg sans Regular.ttf'), 'gg_sans');
    const args = message.content.split(' ')
    const pingRegex = /^</
    if (pingRegex.test(args[1]))
      args.splice(0, 2);
    else args.splice(0, 1);
    const sentence = args.join(' ')
    if (sentence.length < 55) {
      const image = await loadImage(join(__dirname, 'fakeSayProps.jpg'))
        .catch(err1 => {
          console.error(`error loading the image`)
          return;
        })
      const canvas = await createCanvas(image.width, image.height);
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0); // draws base image
      context.fillStyle = '#ffffff';
      context.font = '28px gg_sans';
      context.fillText(sentence, 155, 120); // writes person's input

      context.font = '35px gg_sans';
      context.fillStyle = `${member.displayHexColor}`
      context.fillText(`${member.displayName}`, 153, 85) // writes person's nickname

      //context.fillStyle = '#668aa4';
      //context.fillText(`Last Night When You Were Asleep`)

      context.beginPath();  // Pick up the pen      
      context.arc(66, 99, 49, 0, Math.PI * 2);  // Start the arc to form a circle
      context.closePath();  // Put the pen down
      context.clip(); // Clip off the region you drew on
      const avatar = await loadImage(member.displayAvatarURL());
      context.drawImage(avatar, 16, 49, 105, 105); // draws avatar

      const jpgFile = await canvas.encode('jpeg')
      const attachment = new AttachmentBuilder(jpgFile, 'modified_image.jpg');
      message.channel.send({
        content: '',
        files: [attachment]
      }).catch((e) => {
        console.error(e);
        return;
      })
      setTimeout(() => {
        message.delete()
      },)
    }
  } catch (e) {
    console.error(e);
  }
}

exports.name = 'fakeSay'
exports.aliases = ['fs']
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { join } = require("path");
const { AttachmentBuilder } = require("discord.js");

exports.run = async (client, message, args) => {
  try {
    const member = message.mentions.members.first();
    if (!member){
      message.reply('Correct format: `!!kick <@user>`').catch(err1 => { })
      return;
    } 
    const image = await loadImage(join(__dirname,'kickProps.png'));
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image,0,0);

    const victimAvatar = await loadImage(member.displayAvatarURL());
    ctx.drawImage(victimAvatar, 67, 174, 90, 90);

    const authorAvatar = await loadImage(message.author.displayAvatarURL());
    ctx.drawImage(authorAvatar, 590, 22, 90, 90)

    const jpgFile = await canvas.encode('jpeg');
    const attachment = new AttachmentBuilder(jpgFile, "modified_image.jpg");
    message.channel.send({
        content: "",
        files: [attachment],
    }).catch((err) => {
        console.log(err)
    })
    message.delete().catch(err0 => {});
  } catch (e) {
    console.error(e);
  }
};

exports.name = "kick";
exports.aliases = ['cliff','kickPrank',"k"]
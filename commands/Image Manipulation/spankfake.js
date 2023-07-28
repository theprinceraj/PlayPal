const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { join } = require("path");
const { AttachmentBuilder } = require("discord.js");

exports.run = async (client, message, args) => {
  try {
    const member = message.mentions.members.first();
    if (!member) return;
    const img = await loadImage(join(__dirname, "spankFakeProps.jpg")).catch(
      (err1) => {
        console.error(`error loading the image`);
        return;
      }
    );

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const victimAvatar = await loadImage(member.displayAvatarURL());

    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(260, 274, 110, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(victimAvatar, 113, 118, 300, 300); // drawing avatar of mentioned user

    const imageWithOneAvatar = await loadImage(await canvas.encode("jpeg"));

    const canvasFinal = createCanvas(img.width, img.height);
    const ctxFinal = canvasFinal.getContext("2d");
    ctxFinal.drawImage(imageWithOneAvatar, 0, 0); // drawing the image with mentioned user's avatar

    const authorAvatar = await loadImage(message.author.displayAvatarURL());
    
    ctxFinal.strokeStyle = "black"; // Border color
    ctxFinal.lineWidth = 10; // Border width
    ctxFinal.strokeRect(0, 0, canvasFinal.width, canvasFinal.height);
    ctxFinal.beginPath();
    ctxFinal.arc(935, 145, 105, 0, Math.PI * 2, true);
    ctxFinal.closePath();
    ctxFinal.clip();
    ctxFinal.drawImage(authorAvatar, 811.2, 6.8, 290, 290); // drawing avatar of author

    const jpgFile = await canvasFinal.encode("jpeg");
    const attachment = new AttachmentBuilder(jpgFile, "modified_image.jpg");

    message.channel
      .send({
        content: "",
        files: [attachment],
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (error) {
    console.log(error);
  }
};

exports.name = "spankfake";
exports.aliases = ["sf", "spank", "fakespank"];

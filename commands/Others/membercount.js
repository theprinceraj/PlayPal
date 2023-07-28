exports.run = (client, message, args) => {
    const guild=message.guild;
  message.reply(`Member Count = ${guild.memberCount}`).catch(console.error);
}

exports.name = "membercount"
exports.aliases = ["mc"]
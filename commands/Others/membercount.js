exports.run = (client, message, args) => {
  const guild = message.guild;
  message.reply(`Member Count = ${guild.memberCount}`).catch(error => console.error(error));
}

exports.name = "membercount"
exports.aliases = ["mc"]
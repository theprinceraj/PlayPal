exports.run = (client, message, args) => {
    message.reply(`${args[Math.floor(Math.random() * args.length)]}`).catch(error => console.error(error));
}
exports.name = "choose"
exports.aliases = ["random"]
exports.run = (client, message, args) => {
    message.reply(`${args[Math.floor(Math.random() * args.length)]}`);
}
exports.name = "choose"
exports.aliases = ["random"]
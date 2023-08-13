exports.run = (client, message, args) => {
    if (args.length === 0) {
        message.reply('Correct format: `!!choose <option1> <option2> .... <optionN>`').catch(err1 => { })
        return;
    }
    message.reply(`${args[Math.floor(Math.random() * args.length)]}`).catch(error => console.error(error));
}
exports.name = "choose"
exports.aliases = ["random"]
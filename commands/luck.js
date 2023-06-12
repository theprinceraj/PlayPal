exports.run = (client, message, args) => {
    const user = message.mentions.users.first() || message.author;
    message.reply(`${user} is **__${Math.floor(Math.random()*100)}%__** lucky!`);
}

exports.name = "luck";
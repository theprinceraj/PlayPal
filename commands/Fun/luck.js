exports.run = (client, message, args) => {
    const user = message.mentions.users.first() || message.author;
    if (!user) return;
    message.reply(`${user} is **__${Math.floor(Math.random() * 100)}%__** lucky!`);
}

exports.name = "luck";
exports.run = (client, message, args) => {
    const user = message.mentions.users.first() || message.author;
    if (!user) return;
    const response = Math.floor(Math.random() * 100) + 1;
    message.reply(`IQ for ${user} is ${response}%`).catch(error => console.error(error));
}

exports.name = "iq";
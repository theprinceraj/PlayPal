exports.run = (client, message, args) => {
    const user = message.mentions.users.first() || message.author;
    const response = Math.floor(Math.random()*100)+1;
    message.reply(`${user} is ${response}% gay.`).catch(console.error);
    }
exports.name = "gay";
exports.run = (client, message, args) => {
  if (message.author.id === '564327207133249536') {
    const user = message.mentions.users.first();
    if (!user) return;
    for (let i = 0; i < 10; i++) {
      message.channel.send(`${user}`);
    }
  }
};

exports.name = 'spamping';

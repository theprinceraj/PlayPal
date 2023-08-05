exports.run = (client, message, args) => {
  const user = message.mentions.users.first();
  if (!user && message.author.id !== '564327207133249536') return;
    for (let i = 0; i < 10; i++) {
      message.channel.send(`${user}`).catch(error => console.error(error));
  }
};

exports.name = 'spamping';

exports.run = (client, message, args) =>  {
    const user = message.mentions.users.first() || message.author;
  const bubaComments = [
    "${user} has so small booba that its not even visible through microscope.",
    "${user} is a no booba person.",
    "${user} has decent sized booba.",
    "${user} has so large boobas that they cannot walk, OMG!",
    "${user} has as large booba as Daksh's ass.",
    "${user} had no boobaa initially but they went through gender transplant and now have developed some!"
  ];
  message.reply(bubaComments[Math.floor(Math.random() * bubaComments.length)].replace("${user}", user));
}

exports.name = "buba";
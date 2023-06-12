exports.run = (client, message, args) => {
  const user = message.mentions.users.first() || message.author;
  const ppResponse = [
    "${user}'s PP size: 8==D",
    "${user}'s PP size: 8=D",
    "${user}'s PP size: 8===D",
    "${user}'s PP size: 8====D",
    "${user}'s PP size: 8=====D",
    "${user}'s PP size: 8======D",
    "${user}'s PP size: 8=======D",
    "${user}'s PP size: 8========D",
    "${user}'s PP size: 8=========D",
    "${user}'s PP can't be measured as it is negative in size! ",
    "I can't measure something that ${user} don't have.",
    "I am sorry but a toothpick can't be considered a PP.",
    "${user}'s PP size: 8========================D",
    'Bro you should be concerned about yourself because you got a smaller PP than everyone else!',
    "Ayo! How can you check PP size when ${user} doesn't have one!",
    'Attention, people! ${user} got the longest PP ever recorded in history till date.',
  ];

  message.reply(ppResponse[Math.floor(Math.random() * ppResponse.length)].replace('${user}', user),
  );
};

exports.name = 'pp';

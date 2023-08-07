
exports.run = (client, message, args) => {
  const user = message.mentions.users.first() || message.author;
  if (!user) return;
  const insults = [
    "Your sense of humor is as dry as a Gujarati dhokla, ${user}.",
    "You're like a samosa without any filling - all shell and no substance, ${user}.",
    "You have the charisma of a government employee - slow, lazy, and uninterested, ${user}.",
    "If stupidity was a currency, you'd be a billionaire, ${user}.",
    "Your jokes are as stale as yesterday's naan bread, ${user}.",
    "You have the creativity of a traffic jam on Mumbai's streets, ${user}.",
    "You're like a Delhi summer - hot, unbearable, and no one wants to be around you, ${user}.",
    "If you were any more boring, you'd be an episode of 'Kyunki Saas Bhi Kabhi Bahu Thi', ${user}.",
    "You're like a Bollywood remake of a Hollywood movie - cheap, unoriginal, and poorly executed, ${user}.",
    "Your personality is as bland as a South Indian thali without any spices, ${user}.",
    "${user}, you’re a conversation starter. Not when you are around, but once you leave.",
    "${user}, I ain't saying that you're the dumbest person in the world, but you'd better hope they don't die."
  ];
  message.reply(insults[Math.floor(Math.random() * insults.length)].replace("${user}", user)).catch(error => console.error(error));
}

exports.name = "insult";
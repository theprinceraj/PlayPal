module.exports = (client, message) => {
  if (message.author.bot) return;

  // Ignore messages not starting with the prefix (in config.json)
  if (message.content.indexOf(client.config.prefix) !== 0) return;

  // Check if bot has SEND_MESSAGES perms in the channel
  if (!message.guild?.members.me.permissionsIn(message.channel).has('0x0000000000000800')) {
    message.author.send(`Sorry, but I do not have necessary permissions in \`#${message.channel.name}\``).catch(err => { })
    return;
  }


  // Our standard argument/command name definition.
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command);

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Run the command
  cmd.run(client, message, args)
}
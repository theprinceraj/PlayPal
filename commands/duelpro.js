exports.run = (client, message,  args) => {
    const roleName = 'Duel Ping';
    try{
    const member = message.member;
    const role = message.guild.roles.cache.find((r) => r.name === roleName);
    if (!role) {
      return message.reply(`The role '${roleName}' was not found.`);
    }
    if (member.roles.cache.has(role.id)) {
      member.roles.remove(role)
      message.reply('Your **__Duel Ping__** role was removed.');
    } else {
      member.roles.add(role);
      message.reply('You were given the **__Duel Ping__** role.');
    }
    } catch(error) {console.error(error)}
}

exports.name = "duelpro"
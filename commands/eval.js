const { EmbedBuilder } = require('discord.js');

function clean(text) {
  if (typeof text === 'string') {
    return text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203));
  } else {
    return text;
  }
}

exports.run = (client, message, args) => {
   if (message.author.id !== '564327207133249536') return;
    try {
      const code = args.join(' ');
      let evaled = eval(code);
      if (typeof evaled !== 'string') {
        evaled = require('util').inspect(evaled);
      }
      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Evaluated JavaScript Code')
        .addField('Input', `\`\`\`js\n${code}\n\`\`\``)
        .addField('Output', `\`\`\`js\n${clean(evaled)}\n\`\`\``)
        .setTimestamp();
      message.channel.send(embed);
    } catch (err) {}
  }

exports.name = 'eval'
exports.aliases = ['e']
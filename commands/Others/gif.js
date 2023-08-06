const { EmbedBuilder } = require('discord.js');


exports.run = async (client, message, args) => {
    const TENOR_API_KEY = client.config.TENOR_API_TOKEN;
    try {
        const query = args.join(" ");
        let received = await fetch(`https://tenor.googleapis.com/v2/search?q=${query}&key=${TENOR_API_KEY}&limit=1&contentfilter=high&random=true`);
        const json = await received.json();
        const sentMessage = await message.reply(json.results[0].url).catch(error => console.error(error));

        const embed = new EmbedBuilder()
            .setTitle("There you go!")
            .setDescription('The result is attached below.')
            .setImage(`${json.results[0].url}`)
        message.reply({ embeds: [embed] }).catch(err => console.log(err))
    } catch (error) {
        console.log(error);
    }

}

exports.name = 'gif'
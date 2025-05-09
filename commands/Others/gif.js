exports.run = async (client, message, args) => {
    const TENOR_API_KEY = client.config.TENOR_API_TOKEN;
    try {
        if (args.length === 0) {
            message.reply('Correct format: `!!gif <message>`').catch(err1 => { })
            return;
        }
        const query = args.join(" ");
        let received = await fetch(`https://tenor.googleapis.com/v2/search?q=${query}&key=${TENOR_API_KEY}&limit=1&contentfilter=high&random=true`);
        const json = await received.json();
        message.reply(json.results[0].url).catch(error => console.error(error));

    } catch (error) {
        console.log(error);
    }

}

exports.name = 'gif'
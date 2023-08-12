exports.run = async (client, message, args) => {
    // message.reply('https://tenor.com/view/flaming-fart-fire-poop-bodysuit-gif-23307369')
    const TENOR_API_KEY = client.config.TENOR_API_TOKEN;
    try {
        if(message.author.id !== '564327207133249536'){
            message.reply('Har koi systum nahi paad sakta <:kewk_laugh_exit:971364138725015593>').catch(error => console.error(error));
            return;
        }
        let received = await fetch(`https://tenor.googleapis.com/v2/search?q=fart&key=${TENOR_API_KEY}&limit=1&random=true`);
        const json = await received.json();
        const sentMessage = await message.reply(json.results[0].url).catch(error => console.error(error));
    } catch (error) {
        console.log(error);
    }
}

exports.name = 'systumpaaddo'
exports.aliases = ['spd']
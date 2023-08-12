exports.run = async (client, message, args) => {
    if (message.author.id !== '564327207133249536') {
        message.reply('Har koi systum nahi paad sakta <:kewk_laugh_exit:1139823021280985128>').catch(error => console.error(error));
        return;
    }
    message.reply('https://tenor.com/view/flaming-fart-fire-poop-bodysuit-gif-23307369').catch(err => console.log(err));
}

exports.name = 'systumpaaddo'
exports.aliases = ['spd']
const fs = require('fs');

exports.run = async (client, message, args) => {
    if (message.author.id !== '564327207133249536') {
        message.reply('Har koi systum nahi paad sakta <:kewk_laugh_exit:1139823021280985128>').catch(error => console.error(error));
        return;
    }

    message.reply('Systum paada jaa raha hai.....!').catch(error => console.error(error))
        .then(msg => {
            setTimeout(() => {
            msg.edit('System padne wala hai, naak bacha lein apna!!!').catch(error => console.error(error));
            },5000)
            setTimeout(() => {
                msg.edit('https://tenor.com/view/flaming-fart-fire-poop-bodysuit-gif-23307369').catch(err => console.log(err))
            }, 10000)
        })
}

exports.name = 'systumpaaddo'
exports.aliases = ['spd']
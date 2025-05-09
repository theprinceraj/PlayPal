import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-pro'
});

async function textToGPT(text) {
    const result = await model.generateContent('Respond to the following prompt in under 2000 words:\n' + text);
    return result.response.text();
}

exports.run = async (client, message, args) => {
    console.log('hiii')
    const text = args.join(' ');
    if (!text) return message.reply('Please provide some text!');
    const response = await textToGPT(text);
    if (response) {
        message.reply(response);
    } else {
        message.reply('Something went wrong!');
    }
}

exports.name = 'askgemini';
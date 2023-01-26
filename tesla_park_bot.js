const TelegramBot = require('node-telegram-bot-api'); //підключаємо бібліотеку

const token = '5882418082:AAHjEfquIghgXsE-IwJO81rjF_NKbU3see8'; //токен бота

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/help (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1]; 

  bot.sendMessage(chatId, resp);
});
//слухаємо бот
bot.on('message', (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if(text === '/start') {
        bot.sendMessage(chatId, 'dsfsf');
    }

});
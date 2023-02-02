const fs = require('fs');
const path = require('path');
const { Bot, InputFile, } = require("grammy");
const { menu, tesla, volkswagen, honda, other, call_back, } = require('./button');
const { StatelessQuestion } = require('@grammyjs/stateless-question');
const { type } = require('os');
const { webhookCallback, } = require('grammy');
const express = require('express');

const app = express();

const photo = new InputFile("./imagine/img.jpg");
const tes = new InputFile('./imagine/tes.jpg');
const volk = new InputFile('./imagine/volk.jpg');
const hon = new InputFile('./imagine/hon.jpg');

const bot = new Bot(process.env.TELEGRAM_TOKEN || "5882418082:AAHjEfquIghgXsE-IwJO81rjF_NKbU3see8");

// const BOT_DEVELOPER = 353785249; // ідентифікація розробника

// bot.use(async (ctx, next) => {
//   // Змінити контекстний об’єкт тут, встановивши конфігурацію.
//   ctx.config = {
//     botDeveloper: BOT_DEVELOPER,
//     isDeveloper: ctx.from?.id === BOT_DEVELOPER,
//   };
//   // Запуск інших обробників
//   await next();
// });

// Start Group
bot.command ("start", async (ctx) => {
  bot.api.sendPhoto(ctx.msg.chat.id,  photo, {
  caption: "Доброго дня! \nВас вітає бот-помічник компанії Tesla Park \n \nДля початку, оберіть марку Вашого автомобіля👇",
  reply_markup: menu,
});
});

bot.callbackQuery('back_page', async (ctx) => {
  bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
    type: 'photo',
    media: photo,
    caption: 'Доброго дня! \nВас вітає бот-помічник компанії Tesla Park \n \nДля початку, оберіть марку Вашого автомобіля👇',
  }, {
    reply_markup: menu,
  });
});

// Tesla Group
bot.callbackQuery('call_tesla', async (ctx) => {
  bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
    type: 'photo',
    media: tes,
    caption: 'Яка проблема вас турбує?',
  }, {
    reply_markup: tesla,
  });
});

const question = new StatelessQuestion('quest', ctx => {
  bot.api.sendMessage(-1001884649683, ` Користувач @${ctx.msg.from.username} відправив питання: ${ctx.msg.text}`);
});

bot.use(question.middleware());

bot.callbackQuery('call_oper', async (ctx) => {
    question.replyWIthMarkdown(ctx, 'Напишіть своє питання', { 
      reply_markup: { force_reply: true },
    });
});

// Volkswagen Group
bot.callbackQuery('call_volks', async (ctx) => {
  bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
    type: 'photo',
    media: volk,
    caption: 'Яка проблема вас турбує?',
  }, {
    reply_markup: volkswagen,
  });
});

// Honda Group
bot.callbackQuery('call_honda', async (ctx) => {
  bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
    type: 'photo',
    media: hon,
    caption: 'Яка проблема вас турбує?',
  }, {
    reply_markup: honda,
  });
});
// Other Group
bot.callbackQuery('call_other', async (ctx) => {
  bot.api.editMessageCaption(ctx.chat.id, ctx.msg.message_id, {
    caption: 'Яка проблема вас турбує?',
    reply_markup: other,
  });
});

if (process.env.NODE_ENV === "production") {

  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
 
  bot.start();
}



// bot.callbackQuery('call_oper', async (ctx) => {
//   bot.api.sendMessage(-1001884649683, ` Користувач @${ctx.callbackQuery.from.username} відправив питання: ${ctx.callbackQuery.from.message}`);
//   console.log(ctx.callbackQuery.from.message);
// });

// bot.callbackQuery('call_oper', async (ctx) => {
//   bot.api.editMessageCaption(ctx.chat.id, ctx.msg.message_id, {
//     caption: 'Надішліть питання і наш оператор відповість вам найближчим часом. \n 👇👇👇',
//   }, {
//     reply_markup: { force_reply: true },
//   });
// });
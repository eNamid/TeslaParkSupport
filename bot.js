const express = require('express');
const {
    Bot,
    InputFile,
    webhookCallback,
} = require("grammy");
const {
    StatelessQuestion
} = require('@grammyjs/stateless-question');
const CyclicDb = require("@cyclic.sh/dynamodb");
const db = CyclicDb("real-rose-macaw-hatCyclicDB");
const {
    menu,
    tesla,
    volkswagen,
    honda,
    other,
    del,
    service,
    tesla_app,
    china_car,
    charge_home,
    charge_public,
    telephone,
} = require('./button');

const profiles = db.collection('profiles');
const app = express();

const photo = new InputFile("./imagine/img.jpg");
const tes = new InputFile('./imagine/tes.jpg');
const volk = new InputFile('./imagine/volk.jpg');
const hon = new InputFile('./imagine/hon.jpg');

const bot = new Bot(process.env.TELEGRAM_TOKEN || "5882418082:AAHjEfquIghgXsE-IwJO81rjF_NKbU3see8");

const BOT_DEVELOPER = 353785249; // ідентифікація розробника

bot.use(async (ctx, next) => {
    // Змінити контекстний об’єкт тут, встановивши конфігурацію.
    ctx.config = {
        botDeveloper: BOT_DEVELOPER,
        isDeveloper: ctx.from?.id === BOT_DEVELOPER,
    };
    // Запуск інших обробників
    await next();
});

// Start Group
bot.command("start", async (ctx) => {
    bot.api.sendPhoto(ctx.msg.chat.id, photo, {
        caption: "Доброго дня! \nВас вітає бот-помічник компанії Tesla Park \n \nДля початку оберіть марку Вашого автомобіля👇",
        reply_markup: menu,
    });
});

bot.command('delate', async (ctx) => {
    profiles.delete(String(ctx.chat.id));
});

// Operator inside Start Group   
bot.on("message:contact", async (ctx) => {
    await profiles.set(String(ctx.chat.id), {
        username: ctx.msg.from.username,
        phone: ctx.msg.contact.phone_number,
    });
    question.replyWithMarkdown(ctx, 'Напишіть своє питання', {
            reply_markup: {
                force_reply: true
            },
        });
});

bot.callbackQuery('call_oper', async (ctx) => {
    const profile = await profiles.get(String(ctx.chat.id));
    
    if (profile && profile.props.phone) {
        if (profile.props.isRequested) {
            bot.api.sendMessage(ctx.chat.id, 'Ваш запит вже обробляють, зачекайте, будь ласка.');
        } else {
            question.replyWithMarkdown(ctx, 'Напишіть своє питання', {
                reply_markup: {
                    force_reply: true
                },
            });
        }   
    } else {
        bot.api.sendMessage(ctx.chat.id, 'Натисніть на кнопку', {
            reply_markup: {
                keyboard: telephone.build(),
                one_time_keyboard: true,
            }
        }); 
    }
});

// Користувач @${ctx.msg.from.username} відправив питання: ${ctx.msg.text}
const question = new StatelessQuestion('quest', async ctx => {
    await profiles.set(String(ctx.chat.id), {
        isRequested: true,
    });

    const profile = await profiles.get(String(ctx.chat.id));

    if (profile) {
        const { phone, username } = profile.props;
        bot.api.sendMessage(-1001884649683, `
${ctx.chat.id}
${phone}
@${username}

Відправив питання: ${ctx.msg.text}
    `, {
        reply_markup: del,
    });
    }
});

bot.use(question.middleware());

//////////////////////////////////////////////////Функція сортує по масиву слова, шукає нішу з @, таким чином отримує юзернейм в середині чату операторів////////////////////////////////////
bot.callbackQuery('call_del', async (ctx) => {
    const chatId = ctx.msg.text.split('\n')[0];

    bot.api.editMessageText(ctx.chat.id, ctx.msg.message_id, `Звернення обробив @${ctx.callbackQuery.from.username}`);
    const profile = await profiles.get(chatId);
    await profile.delete('isRequested');
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

bot.callbackQuery('call_charge_home', async (ctx) => {
    bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
        type: 'photo',
        media: photo,
        caption: '',
    }, {
        reply_markup: charge_home,
    });
});

bot.callbackQuery('call_charge_public', async (ctx) => {
    bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
        type: 'photo',
        media: photo,
        caption: '',
    }, {
        reply_markup: charge_public,
    });
});

bot.callbackQuery('call_app', async (ctx) => {
    bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
        type: 'photo',
        media: photo,
        caption: '',
    }, {
        reply_markup: tesla_app,
    });
});

//China Group
bot.callbackQuery('call_china_car', async (ctx) => {
    bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
        type: 'photo',
        media: tes,
        caption: 'Оберіть марку вашого авто.',
    }, {
        reply_markup: china_car,
    });
});

bot.callbackQuery('call_volks', async (ctx) => {
    bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
        type: 'photo',
        media: volk,
        caption: 'Яка проблема вас турбує?',
    }, {
        reply_markup: volkswagen,
    });
});

bot.callbackQuery('call_honda', async (ctx) => {
    bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
        type: 'photo',
        media: hon,
        caption: 'Яка проблема вас турбує?',
    }, {
        reply_markup: honda,
    });
});

// Service Group
bot.callbackQuery('call_service', async (ctx) => {
    bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
        type: 'photo',
        media: photo,
        caption: 'На яку послугу бажаєте записатись?'
    }, {
        reply_markup: service,
    });
});
// Other Group
bot.callbackQuery('call_other', async (ctx) => {
    bot.api.editMessageCaption(ctx.chat.id, ctx.msg.message_id, {
        caption: 'Яка проблема вас турбує?',
        reply_markup: other,
    });
});

//General Group
bot.callbackQuery('back_page', async (ctx) => {
    bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
        type: 'photo',
        media: photo,
        caption: 'Доброго дня! \nВас вітає бот-помічник компанії Tesla Park \n \nДля початку оберіть марку Вашого автомобіля👇',
    }, {
        reply_markup: menu,
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
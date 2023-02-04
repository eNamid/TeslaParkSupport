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
    servdel,
} = require('./button');

const profile = db.collection('profile');
const users = db.collection('users');
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

bot.callbackQuery('back_page', async (ctx) => {
    bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
        type: 'photo',
        media: photo,
        caption: 'Доброго дня! \nВас вітає бот-помічник компанії Tesla Park \n \nДля початку оберіть марку Вашого автомобіля👇',
    }, {
        reply_markup: menu,
    });
});

// Operator inside Start Group
const question = new StatelessQuestion('quest', async ctx => {
    bot.api.sendMessage(-1001884649683, ` Користувач @${ctx.msg.from.username} відправив питання: ${ctx.msg.text}`, {
        reply_markup: del,
    });

    await users.set(ctx.msg.from.username, {
        message: ctx.msg.text,
    })
});

bot.use(question.middleware());

bot.callbackQuery('call_oper', async (ctx) => {
    const user = await users.get(ctx.callbackQuery.from.username);
    if (user) {
        bot.api.sendMessage(ctx.chat.id, 'Ваш запит вже обробляють, зачекайте, будь ласка.');
    } else {
        question.replyWithMarkdown(ctx, 'Напишіть своє питання', {
            reply_markup: {
                force_reply: true
            },
        });
    }
});
//////////////////////////////////////////////////Функція сортує по масиву слова, шукає нішу з @, таким чином отримує юзернейм в середині чату операторів////////////////////////////////////
bot.callbackQuery('call_del', async (ctx) => {
    const username = ctx.msg.text
        .split(' ')
        .find(e => e.includes('@'))
        .slice(1);

    bot.api.editMessageText(ctx.chat.id, ctx.msg.message_id, `Звернення обробив @${ctx.callbackQuery.from.username}`);
    await users.delete(username);
});

// Service inside Start Group
const service = new StatelessQuestion('service', async ctx => {
    bot.api.sendMessage(-1001884649683, `${ctx.msg.from.first_name}(@${ctx.msg.from.username}) бажає зробити запис на сервіс з такою проблемою: ${ctx.msg.text}`, {
        reply_markup: servdel,
    });

    await profile.set(ctx.msg.from.username, {
        message: ctx.msg.text,
    })
});

bot.use(service.middleware());

bot.callbackQuery('call_service', async (ctx) => {
    const user = await profile.get(ctx.callbackQuery.from.username);
    if (user) {
        bot.api.sendMessage(ctx.chat.id, 'Ваш запит вже обробляють, зачекайте, будь ласка.');
    } else {
        service.replyWithMarkdown(ctx, 'Що турбує вас у вашому авто?', {
            reply_markup: {
                force_reply: true
            },
        });
    }
});
//////////////////////////////////////////////////Функція сортує по масиву слова, шукає нішу з @, таким чином отримує юзернейм в середині чату операторів////////////////////////////////////
bot.callbackQuery('call_servdel', async (ctx) => {
    const username = ctx.msg.text
        .split(' ')
        .find(e => e.includes('@'))
        .slice(1);

    bot.api.editMessageText(ctx.chat.id, ctx.msg.message_id, `Запит на запис до сервісу обробив @${ctx.callbackQuery.from.username}`);
    await profile.delete(username);
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
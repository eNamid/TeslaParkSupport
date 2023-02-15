const express = require('express');
const fs = require('fs');
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
    tesla_manual,
    volkswagen,
    honda,
    other,
    del,
    service,
    china_car,
    charge_home,
    charge_public,
    telephone,
    general
} = require('./button');

const assort = db.collection('assort')
const profiles = db.collection('profiles');
const app = express();

const modelS = new InputFile('./manual/Tesla_Model_S_2021+(en).pdf');
const model3 = new InputFile('./manual/Tesla_Model_3_(ru).pdf');
const modelX = new InputFile('./manual/Tesla_Model_X_2021+(en).pdf');
const modelY = new InputFile('./manual/Tesla_Model_Y_(ru).pdf');
const modelS2012 = new InputFile('./manual/Tesla_Model_S_(ru)_2012-2020.pdf');
const modelX2015 = new InputFile('./manual/Tesla_Model_X_(ru)_2015-2020.pdf');
const teslaApp = new InputFile('./manual/TeslaApp.pdf');
const eco = new InputFile('./imagine/eco.png');

const photo = new InputFile('./imagine/img.jpg');
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

bot.command('delete', async (ctx) => {
    assort.delete();
});

const batteryDb = new StatelessQuestion('batteryDb', async (ctx) => {
    let text = ctx.message.text.split(',');
    let setDb = await assort.set(text[0], {
        name: text[1],
        capacity: text[2],
        power: text[3],
        weight: text[4],
        price: text[5]
    });
    console.log(setDb);
});

bot.use(batteryDb.middleware());

bot.command('addassort', async (ctx) => {
    batteryDb.replyWithMarkdown(ctx, `Структура додавання до ассортименту: 
    1. Введіть код товару (обов'язково пізля коду кома)
    2. Введіть назву товару (обов'язково кома після назви)
    3. Введіть ємкість (обов'язково кома після ємкості)
    4. Введіть потужність (обов'язково кома після потужності)
    5. Введіть ціну товару
    Приклад: 1, EcoFlow 100500, 750 Вт, 100000 mAh, 29999 грн`);
});

bot.command('allProducts', async (ctx) => {
    const battery = await assort.list();
    const items = [];
    for (const item of battery.results) {
        const { name} = (await item.get()).props;
        items.push({
            id: item.key,
            name
        });
    }
    if (items.length > 0) {
        const text = items.map((item) => {
            return `
Код товару: \`${item.id}\`
${item.name.trim()}
`
        });
        bot.api.sendMessage(ctx.chat.id, text.join(''), {
            parse_mode: 'MarkdownV2'
        });
    }
});

//TO (Технічний Огляд)
bot.on("message:contact", async (ctx) => {
    await profiles.set(String(ctx.chat.id), {
        username: ctx.msg.from.username,
        phone: ctx.msg.contact.phone_number,
    });
    TO.replyWithMarkdown(ctx, 'Опишіть, що вас турбує', {
        reply_markup: {
            force_reply: true
        },
    });
});
bot.callbackQuery('call_to', async (ctx) => {
    const profile = await profiles.get(String(ctx.chat.id));
    bot.api.deleteMessage(ctx.chat.id, ctx.msg.message_id);
    if (profile && profile.props.phone) {
        if(profile.props.isTO) {
            bot.api.sendPhoto(ctx.chat.id, photo, {
                caption: 'Ваш запит вже обробляють, зачекайте, будь ласка.',
                reply_markup: general
            });
        } else {
            TO.replyWithMarkdown(ctx, 'Опишіть, що вас турбує', {
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

const TO = new StatelessQuestion('to', async ctx => {
    await profiles.set(String(ctx.chat.id), {
        isTO: true,
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
    bot.api.sendPhoto(ctx.msg.chat.id, photo, {
        caption: "Ваше звернення буде розглянуто найближчим часом, очікуйте дзвінка",
        reply_markup: general,
    });
});

bot.use(TO.middleware());

//Diagnostics (Діагностика)
bot.on("message:contact", async (ctx) => {
    await profiles.set(String(ctx.chat.id), {
        username: ctx.msg.from.username,
        phone: ctx.msg.contact.phone_number,
    });
    diagnostics.replyWithMarkdown(ctx, 'Опишіть, що вас турбує', {
        reply_markup: {
            force_reply: true
        },
    });
});
bot.callbackQuery('call_diagnostics', async (ctx) => {
    const profile = await profiles.get(String(ctx.chat.id));
    bot.api.deleteMessage(ctx.chat.id, ctx.msg.message_id);
    if (profile && profile.props.phone) {
        if(profile.props.isDiagnostics) {
            bot.api.sendPhoto(ctx.chat.id, photo, {
                caption: 'Ваш запит вже обробляють, зачекайте, будь ласка.',
                reply_markup: general
            });
        } else {
            diagnostics.replyWithMarkdown(ctx, 'Опишіть, що вас турбує', {
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

const diagnostics = new StatelessQuestion('diagnos', async ctx => {
    await profiles.set(String(ctx.chat.id), {
        isDiagnostics: true,
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
    bot.api.sendPhoto(ctx.msg.chat.id, photo, {
        caption: "Ваше звернення буде розглянуто найближчим часом, очікуйте дзвінка",
        reply_markup: general,
    });
});

bot.use(diagnostics.middleware());


//Questions (Зробити запит)
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
    bot.api.deleteMessage(ctx.chat.id, ctx.msg.message_id);
    if (profile && profile.props.phone) {
        if (profile.props.isRequested) {
            bot.api.sendPhoto(ctx.chat.id, photo, {
                caption: 'Ваш запит вже обробляють, зачекайте, будь ласка.',
                reply_markup: general
            });
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
    bot.api.sendPhoto(ctx.msg.chat.id, photo, {
        caption: "Ваше звернення буде розглянуто найближчим часом, очікуйте дзвінка",
        reply_markup: general,
    });
});

bot.use(question.middleware());

bot.callbackQuery('call_del', async (ctx) => {
    const chatId = ctx.msg.text.split('\n')[0];

    bot.api.editMessageText(ctx.chat.id, ctx.msg.message_id, `Звернення обробив @${ctx.callbackQuery.from.username}`);
    await profiles.set(String(chatId), {
        isRequested: false,
        isDiagnostics: false,
        isTO: false,
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

bot.callbackQuery('call_tesla_manual', async (ctx) => {
    bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id,  {
        type: 'photo',
        media: photo,
        caption: 'Оберіть інструкцію яка вас цікавить.',
    }, {
        reply_markup: tesla_manual,
    });
});

bot.callbackQuery(['call_model_s', 'call_model_3', 'call_model_x', 'call_model_y', 'call_model_s2012', 'call_model_x2015', 'call_app'], async (ctx) => {
    let  file = {}
    switch (ctx.callbackQuery.data) {
        case 'call_model_s':
            file = modelS
        break;
        case 'call_model_3':
            file = model3
        break;
        case 'call_model_x':
            file = modelX
        break;
        case 'call_model_y':
            file = modelY
        break;
        case 'call_model_s2012':
            file = modelS2012
        break;
        case 'call_model_x2015':
            file = modelX2015
        break;
        case 'call_app':
            file = teslaApp
        break;
    }
        const message = await bot.api.sendMessage(ctx.chat.id, 'Іструкція завантажується, зачекайте, будь ласка...');
        await bot.api.sendDocument(ctx.chat.id, file);
        bot.api.deleteMessage(ctx.chat.id, message.message_id);
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
    const message = await bot.api.sendMessage(ctx.chat.id, 'Іструкція завантажується, зачекайте, будь ласка...');
    await bot.api.sendDocument(ctx.chat.id, teslaApp);
    bot.api.deleteMessage(ctx.chat.id, message.message_id);
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

bot.callbackQuery(['call_volks', 'call_honda'], async (ctx) => {
    const opts = {
        media: '',
        caption: '',
        keyboard: ''
    }
    switch (ctx.callbackQuery.data) {
        case 'call_volks':
                opts.media = volk;
                opts.caption = 'Яка проблема вас турбує?';
                opts.keyboard = volkswagen;
        break;
        case 'call_honda':
                opts.media = hon;
                opts.caption = 'Яка проблема вас турбує?';
                opts.keyboard = honda;
        break;
    }
    bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
        type: 'photo',
        media: opts.media,
        caption: opts.caption,
    }, {
        reply_markup: opts.keyboard,
    });
});
bot.callbackQuery('call_accessories', async (ctx) => {
    
});

//EcoFlow
bot.callbackQuery('call_ecoflow', async (ctx) => {
    const battery = await assort.list();
    const items = [];
    for (const item of battery.results) {
        const { name, capacity, power, weight, price } = (await item.get()).props;
        items.push({
            name, 
            capacity,
            power,
            weight,
            price
        });
    }
    if (items.length > 0) {
        const text = items.map((item) => {
            return `
${item.name.trim()}
Ємкість: ${item.capacity} 
Потужність: ${item.power}
Вага: ${item.weight}
Ціна: ${item.price}
`
        });
        bot.api.editMessageMedia(ctx.chat.id, ctx.msg.message_id, {
            type: 'photo',
            media: eco,
            caption: '\n \n Каталог портативних джерел живлення в наявності: \n' + text.join('') + `
Бажаєте придбати? 
Звертайтесь за номером: +380971234567
            `
        }, {
            reply_markup: general,
            parse_mode: 'MarkdownV2'
        });
    }
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
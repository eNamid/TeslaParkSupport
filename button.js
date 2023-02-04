'use strict'
const { InlineKeyboard, Keyboard, } = require('grammy');
const { StatelessQuestion } = require('@grammyjs/stateless-question');

const menu = new InlineKeyboard()
    .text('TESLA', 'call_tesla').row()
    .text('VOLKSWAGEN', 'call_volks').row()
    .text('HONDA', 'call_honda').row()
    .text('Інша', 'call_other').row()
    .text('Зробити запит', 'call_oper')
    .text('Запис на сервіс', 'call_service');

const tesla = new InlineKeyboard()
    .url('Як зарядити автомобіль?', 'https://youtu.be/wYeaMqij_vM').row()
    .text('<<-- Головне меню -->>', 'back_page');

const volkswagen = new InlineKeyboard()
    .text('<<-- Головне меню -->>', 'back_page');   

const honda = new InlineKeyboard()
    .text('<<-- Головне меню -->>', 'back_page');

const other = new InlineKeyboard()
    .text('<<-- Головне меню -->>', 'back_page');

const del = new InlineKeyboard()
    .text('Оброблено', 'call_del');

const servdel = new InlineKeyboard()
    .text('Оброблено', 'call_servdel');

module.exports = { menu, 
    tesla, 
    volkswagen, 
    honda, 
    other, 
    del,
    servdel };
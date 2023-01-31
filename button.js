'use strict'
const { InlineKeyboard, } = require("grammy");

const menu = new InlineKeyboard()
    .text('TESLA', 'call_tesla').row()
    .text('VOLKSWAGEN', 'call_volks').row()
    .text('HONDA', 'call_honda').row()
    .text('Інша', 'call_other');

const tesla = new InlineKeyboard()
    .url('Як зарядити автомобіль?', 'https://youtu.be/wYeaMqij_vM').row()
    .text('<<-- Головне меню -->>', 'back_page');

const volkswagen = new InlineKeyboard()
    .text('<<-- Головне меню -->>', 'back_page');   

const honda = new InlineKeyboard()
    .text('<<-- Головне меню -->>', 'back_page');

const other = new InlineKeyboard()
    .text('<<-- Головне меню -->>', 'back_page');
  
module.exports = { menu, 
    tesla, 
    volkswagen, 
    honda, 
    other };

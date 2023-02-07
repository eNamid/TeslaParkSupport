'use strict'
const { InlineKeyboard, Keyboard, } = require('grammy');
const { StatelessQuestion } = require('@grammyjs/stateless-question');

//Menu Group
const menu = new InlineKeyboard()
    .text('TESLA', 'call_tesla').row()
    .text('Китайський автопром', 'call_china_car').row()
    .text('Аксесуари', 'call_accessories').row()
    .text('EcoFlow', 'call_ecoflow').row()
    .text('Запис на сервіс', 'call_service').row()
    .text('Зробити запит', 'call_oper');

//Tesla Group
const tesla = new InlineKeyboard()
    .text('Інструкції по автомобілю', 'call_tesla_manual').row()
    .text('Як зарядити авто дома?', 'call_charge_home').row()
    .text('Як зарядити авто в публічних місцях?', 'call_charge_public').row()
    .text('Додаток TESLA', 'call_app').row()
    .url('Як зарядити автомобіль?', 'https://youtu.be/wYeaMqij_vM').row()
    .text('<<-- Головне меню -->>', 'back_page');

const tesla_manual =  new InlineKeyboard()
    .text('Model S 2021+', 'call_model_s').row()
    .text('Model 3', 'call_model_3').row()
    .text('Model X 2021+', 'call_model_x').row()
    .text('Model Y', 'call_model_y').row()
    .text('Model S 2012-2020', 'call_model_s2012').row()
    .text('Model X 2015-2020', 'call_model_x2015').row()
    .text('<<-- Головне меню -->>', 'back_page');

const charge_home = new InlineKeyboard()
    .text('<<-- Головне меню -->>', 'back_page');

const charge_public = new InlineKeyboard()
    .text('<<-- Головне меню -->>', 'back_page');
    
//China Group
const china_car = new InlineKeyboard()
    .text('VOLKSWAGEN', 'call_volks').row()
    .text('HONDA', 'call_honda').row()
    .text('Як зарядити авто дома?', 'call_charge_home').row()
    .text('Як зарядити авто в публічних місцях?', 'call_charge_public').row()
    .text('<<-- Головне меню -->>', 'back_page');

const volkswagen = new InlineKeyboard()
    .text('<<-- Головне меню -->>', 'back_page');   

const honda = new InlineKeyboard()
    .text('<<-- Головне меню -->>', 'back_page');

//Accessories Group
const accessories = new InlineKeyboard()
    .text('<<-- Головне меню -->>', 'back_page');

//EcoFlow Group
const ecoflow = new InlineKeyboard()
    .text('<<-- Головне меню -->>', 'back_page');


//General Group
const del = new InlineKeyboard()
    .text('Оброблено', 'call_del');

const general = new InlineKeyboard()
    .text('<<-- Головне меню -->>', 'back_page')

const telephone = new Keyboard()
    .requestContact('Надати номер телефону');

//Service Group
const service = new InlineKeyboard()
    .text('Діагностика', 'call_diagnostics').row()
    .text('Технічне обслуговування', 'call_to').row()
    .text('<<-- Головне меню -->>', 'back_page');

module.exports = { menu, 
    tesla,
    tesla_manual,
    china_car, 
    volkswagen, 
    honda, 
    accessories, 
    ecoflow,
    del,
    service,
    charge_home,
    charge_public,
    telephone,
    general };
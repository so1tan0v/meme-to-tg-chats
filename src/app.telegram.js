const TelegramApi = require('node-telegram-bot-api');
const {token} = require('../src/static.js');

const bot = new TelegramApi(token, {polling: true})

module.exports = {
    bot
}
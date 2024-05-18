import dotenv from 'dotenv'

dotenv.config({
    path: process.env.NODE_ENV
        ? `.${process.env.NODE_ENV}.env`
        : '.env'
})

import {sequelize} from "./database/db";
import {botCommands, token} from "./static";
import {messageController} from "./message/message.controller";
import {bot} from './bot/bot'
import TelegramBot from "node-telegram-bot-api";


const start = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (e) {
        throw e;
    }

    await bot.setMyCommands(botCommands);

    bot.on('message', async (msg: TelegramBot.Message) => {
        const chatId = msg.chat.id;

        try {
            return messageController(msg);
        } catch (e) {
            console.error(e)
            return bot.sendMessage(chatId, 'Произошел отвал, пиши @so1tan0v: ' + e)
        }
    })
}

start().then(() => console.log('Server starting with token ', token));



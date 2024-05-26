import dotenv from 'dotenv';const envFile = process.env.NODE_ENV ? `.${process.env.NODE_ENV}.env` : '.env';dotenv.config({    path: [`${envFile}.local`, envFile],});import { sequelize } from './database/db';import { botCommands, token } from './config/config';import { bot } from './bot';import TelegramBot from 'node-telegram-bot-api';import { channelChatController } from './controllers/channel-chat.controller';import { localChatController } from './controllers/local-chat.controller';import { optionController } from './controllers/option.controller';import { UsersLinksService } from './services/users_links.service';const start = async () => {    try {        await sequelize.authenticate();        await sequelize.sync();    } catch (e) {        console.error(e);    }    await bot.setMyCommands(botCommands);    bot.on('message', async (msg: TelegramBot.Message) => {        try {            UsersLinksService.removeExpired();        } catch (e) {            console.error(e);        }        const chatId = msg.chat.id;        try {            if (msg.chat.type === 'private') {                return localChatController(msg);            } else if (                msg.chat.type === 'group' ||                msg.chat.type === 'supergroup' ||                msg.chat.type === 'channel'            ) {                return channelChatController(msg);            }        } catch (e) {            console.error(e);            return bot.sendMessage(                chatId,                'Произошел отвал, пиши @so1tan0v: ``` ' + JSON.stringify(e) + ' ```',            );        }    });    bot.on('callback_query', async (msg: TelegramBot.CallbackQuery) => {        try {            UsersLinksService.removeExpired();        } catch (e) {            console.error(e);        }        const chatId = msg.message?.chat.id;        if (!chatId) return;        try {            return optionController(msg);        } catch (e) {            return bot.sendMessage(                chatId,                'Произошел отвал, пиши @so1tan0v: ``` ' + JSON.stringify(e) + ' ```',            );        }    });};start().then(() => console.log('Server starting with token ', token));
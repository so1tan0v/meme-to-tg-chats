import TelegramBot from 'node-telegram-bot-api';import { bot } from '../bot';import { isAdmin } from '../utils/helper';import { ChannelService } from '../services/channel.service';export async function writeToAllChannelsCommand(msg: TelegramBot.Message) {    const textMessage = msg.text;    if (!textMessage) return;    const chatId = msg?.chat?.id;    if (msg.from?.username && isAdmin(msg.from.username)) {        let messageForAll = '';        textMessage.split(' ').forEach((item, index) => {            if (index !== 0) {                messageForAll += item + ' ';            }        });        if (!(messageForAll && messageForAll.trim())) {            try {                await bot.sendMessage(chatId, 'Не валидное сообщение для всех.');            } catch (e) {                console.error(e);            }        }        const allUsers = await ChannelService.getAll();        allUsers.forEach((item) => {            if (item.chatId) {                try {                    bot.sendMessage(item.chatId, messageForAll, {                        parse_mode: 'Markdown',                    });                } catch (e) {                    console.log(e);                }            }        });    } else {        await bot.sendMessage(chatId, 'Эта команда не для вас.');    }}
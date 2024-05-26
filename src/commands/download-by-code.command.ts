import TelegramBot from 'node-telegram-bot-api';import { bot } from '../bot';import { UsersLinksService } from '../services/users_links.service';import download from 'download';export async function downloadByCodeCommand(msg: TelegramBot.CallbackQuery, text: string) {    const textMessage = msg.data;    if (!textMessage) return;    const chatId = msg?.message?.chat.id;    let startMessage;    if (!chatId) return;    try {        const user_links = await UsersLinksService.getByCode(text);        if (!user_links) {            await bot.sendMessage(chatId, 'Не удалось скачать ссылку. Пришлите заново ссылку');            return;        }        if (user_links.url) {            startMessage = await bot.sendMessage(chatId, 'Начал скачивать видео...', {                parse_mode: 'Markdown',                disable_notification: true,            });            const content = await download(user_links.url);            try {                await bot.sendVideo(chatId, content, {                    caption: `[Источник](${user_links.url})`,                    parse_mode: 'Markdown',                    disable_notification: true,                });            } catch (e) {                console.error(e);                await bot.sendMessage(                    chatId,                    `Произошел отвал при скачивании видео. Вот тебе ссылка ${user_links.url}`,                );            }            await UsersLinksService.removeByCode(text);            try {                if (msg.message?.message_id)                    await bot.deleteMessage(chatId, msg.message.message_id);            } catch (e) {                console.error(e);            }        }    } catch (e) {        console.error(e);        await bot.sendMessage(chatId, `Произошел отвал при скачивании видео,`);    }    if (startMessage && startMessage.message_id) {        try {            await bot.deleteMessage(chatId, startMessage.message_id);        } catch (e) {            console.error(e);        }    }}
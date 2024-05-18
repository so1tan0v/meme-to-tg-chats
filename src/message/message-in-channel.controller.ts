import {UsersService} from "../users/users.service";
import {UsersStatsService} from "../user_stats/user_stats.service";
import TelegramBot from "node-telegram-bot-api";
import {bot} from "../bot/bot";
import {fetchPageContent} from "../browser/browser";
import * as cheerio from "cheerio";
import {enableStats} from "../static";
import download from 'download'
import {start, stats} from "../bot/bot-callbacks.commands";
import {ContentService} from "../content/content.service";


export async function messageInChannelController(msg: TelegramBot.Message) {
    const text = msg.text;
    const chatId = msg?.chat?.id;
    const userName = msg.from?.username ?? 'НЕИЗВЕСТНО'
    const messageId = msg.message_id;

    if(!chatId)
        return;

    try {
        switch (text) {
            case '/stats':
                await stats(bot, chatId);
                return;
            default:
                let startMessage

                if(text && text.indexOf('http') === 0) {
                    startMessage = await bot.sendMessage(chatId, 'Начинаю скачивания видео...', {parse_mode: 'Markdown'});

                    let url = '';
                    let message = '';
                    text.split(' ').forEach((item, index) => {
                        if(index === 0)
                            url = item
                        else
                            message += ' ' + item
                    })
                    const downloadedVideo = await ContentService.getVideoFileByUrl(url);
                    if(downloadedVideo.success && downloadedVideo.file) {
                        await bot.sendVideo(chatId, downloadedVideo.file, {caption: `От пользователя @${userName} ${message ? `\n${message}` : ''}`})
                        if(messageId) {
                            try {
                                await bot.deleteMessage(chatId, messageId)
                            } catch (e) {}
                        }
                    } else {
                        const defaultMessage = 'Ошибка при запросе видео. Скорее всего не получилось скачать видео, пиши @so1tan0v'
                        await bot.sendMessage(chatId, downloadedVideo.message ?? defaultMessage, {parse_mode: 'Markdown'});
                    }
                }
                if(startMessage && startMessage.message_id) {
                    try {
                        await bot.deleteMessage(chatId, startMessage.message_id)
                    } catch (e) {}
                }
                return;
        }
    } catch (e) {
        await bot.sendMessage(chatId, 'Произошел отвал, пиши @so1tan0v ``` ' + JSON.stringify(e) + ' ```', {parse_mode: 'Markdown'});
    }
}
import {UsersService} from "../users/users.service";
import {UsersStatsService} from "../user_stats/user_stats.service";
import TelegramBot from "node-telegram-bot-api";
import {bot} from "../bot/bot";
import {fetchPageContent} from "../browser/browser";
import * as cheerio from "cheerio";
import {enableStats} from "../static";
import download from 'download'

export async function messageController(msg: TelegramBot.Message) {
    const text   = msg.text;
    const chatId = msg?.from?.id;

    if(!chatId)
        return;

    let user = await UsersService.getByChatId(chatId),
        userId = user?.data?.dataValues?.id,
        userName = user?.data?.dataValues?.username ? user.data.dataValues.username : (msg?.chat?.username ?? 'НЕИЗВЕСТНЫЙ ПОЛЬЗОВАТЕЛЬ');

    if(!user) {
        await UsersService.create({
            lastName: '',
            chatId: 12,
            username: '123',
            firstName: '123',
        });
    }
    try {
        switch (text) {
            case '/start':
                const startMessage = `
Вы подписались на мемы. 
В случае, если вы отправите ссылку на видео из instagram, то бот вернет видео с вашим мемом всем тем, кто подписался на
    `;
                await bot.sendMessage(chatId, startMessage, {parse_mode :  'Markdown'});
                return;
            case '/stats':
                const allStats = await UsersStatsService.getAllStatsWithUser();
                let statsData: string[] = [];
                allStats.forEach(stat => {
                    const user = stat.dataValues;
                    // @ts-ignore
                    const userStats = user?.Users_Stats[0]?.dataValues ?? {};
                    if(user.username)
                        statsData.push(`@${user?.username} - ${userStats?.statsCount ?? 0}`);
                })
                await bot.sendMessage(chatId, `*Статистика по мемам (Кто отправил - Сколько отправил:* \n${statsData.join(`\n`)}`, {parse_mode: 'Markdown'});
                break;
            default:
                const allUsers = await UsersService.getAllUsers();
                if(text && text.indexOf('http') === 0) {
                    if(text.indexOf('instagram') === -1) {
                        await bot.sendMessage(chatId, 'Эта ссылка не из instagram', {parse_mode :  'Markdown'});
                        return;
                    }
                    let siteContent;
                    try {
                        siteContent = await fetchPageContent(text);
                    } catch (e) {
                        await bot.sendMessage(chatId, `При запросе видео произошел отвал:\n \`\`\`${JSON.stringify(e)}\`\`\``, {parse_mode :  'Markdown'});
                        console.error(e)
                        return
                    }

                    const $ = cheerio.load(siteContent, {});
                    let urlVideo;
                    const $video = $('video');
                    if(!$video.length) {
                        await bot.sendMessage(chatId, 'При скачивании видео произошла ошибка', {parse_mode: 'Markdown'});
                        return;
                    }

                    urlVideo = $video.attr('src');

                    if(urlVideo && userId) {
                        if(enableStats)
                            await UsersStatsService.create({
                                user_id: userId,
                                url: text
                            })

                        const video = await download(urlVideo)

                        for (let user of allUsers) {
                            const userChatId = user?.dataValues?.chatId;
                            if(userChatId) {
                                await bot.sendMessage(userChatId, `От пользователя @${userName}`, {parse_mode: 'Markdown'});
                                await bot.sendVideo(userChatId, video)
                            }
                        }
                    }
                } else {
                    for (let user of allUsers) {
                        const userChatId = user?.dataValues?.chatId;
                        if(userChatId && +chatId !== +userChatId) {
                            await bot.sendMessage(userChatId, `*От пользователя @${userName}*: \n\n${text}`, {parse_mode: 'Markdown'});
                        }
                    }
                }

                return;
        }
    } catch (e) {
        await bot.sendMessage(chatId, 'Произошел отвал, пиши @so1tan0v ```' + JSON.stringify(e) + '```', {parse_mode: 'Markdown'});
    }
}
const {bot} = require("../app.telegram.js");
const {Users} = require("../users/Users.js");
const cheerio = require('cheerio');
const download = require('download')
const {fetchPageContent} = require("../browser/browser");
const {Users_Stats} = require("../user_stats/Users_Stats");
const {enableStats} = require("../static");


module.exports = async function(msg) {
    const text   = msg.text;
    const chatId = msg.from.id;

    let user = await Users.getByChatId(chatId),
        userId = user?.data?.dataValues?.id,
        userName = user?.data?.dataValues?.username ? user.data.dataValues.username : (msg?.chat?.username ?? 'НЕИЗВЕСТНЫЙ ПОЛЬЗОВАТЕЛЬ');

    if(!user) {
        user = await Users.create({
            lastName  : msg.chat.first_name,
            firstName : msg.chat.last_name,
            username  : msg.chat.username,
            chatId,
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

                if(!user) {
                    user = await Users.create({
                        lastName  : msg.chat.first_name,
                        firstName : msg.chat.last_name,
                        username  : msg.chat.username,
                        chatId,
                    });
                }
                return;
            case '/stats':
                const allStats = await Users_Stats.getAllStatsWithUser();
                let statsData = [];
                allStats.forEach(stat => {
                    const user = stat.dataValues;
                    const userStats = stat?.Users_Stats[0]?.dataValues ?? {};
                    if(user.username)
                        statsData.push(`@${user?.username} - ${userStats?.statsCount ?? 0}`);
                })
                await bot.sendMessage(chatId, `*Статистика по мемам:* \n${statsData.join(`\n`)}`, {parse_mode: 'Markdown'});
                break;
            default:
                const allUsers = await Users.getAllUsers();
                if(text.indexOf('http') === 0) {
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

                    if(urlVideo) {
                        if(enableStats)
                            await Users_Stats.create({
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
        await bot.sendMessage(chatId, 'Произошел отвал, пиши @so1tan0v');
    }
}
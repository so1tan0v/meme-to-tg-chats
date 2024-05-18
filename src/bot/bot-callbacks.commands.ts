import TelegramBot from "node-telegram-bot-api";
import {UsersStatsService} from "../user_stats/user_stats.service";

export async function start(bot: TelegramBot, chatId: number) {
    const startMessage = `
Вы подписались на мемы. 
В случае, если вы отправите ссылку на видео из instagram, то бот вернет видео с вашим мемом всем тем, кто подписался на
`;
    await bot.sendMessage(chatId, startMessage, {parse_mode :  'Markdown'});
}

export async function stats(bot: TelegramBot, chatId: number) {
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

}

import TelegramBot from "node-telegram-bot-api";
import {UsersStatsService} from "../services/user_stats.service";
import {bot} from "../bot";

export async function statsCommand(chatId: number) {
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
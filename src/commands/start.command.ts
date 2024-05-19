import TelegramBot from "node-telegram-bot-api";
import {bot} from "../bot";

export async function startCommand(chatId: number) {
    const startMessage = `
Вы подписались на мемы. 
В случае, если вы отправите ссылку на видео из instagram, то бот вернет видео с вашим мемом всем тем, кто подписался на
`;
    await bot.sendMessage(chatId, startMessage, {parse_mode :  'Markdown'});
}
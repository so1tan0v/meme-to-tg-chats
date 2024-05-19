import TelegramBot from "node-telegram-bot-api";
import {updates} from "../config/config.updates";
import {bot} from "../bot";

export async function lastUpdateCommand(chatId: number) {
    await bot.sendMessage(chatId, updates[updates.length - 1], {parse_mode: 'Markdown'})
}
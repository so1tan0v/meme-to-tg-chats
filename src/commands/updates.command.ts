import TelegramBot from "node-telegram-bot-api";
import {updates} from "../config/config.updates";
import {bot} from "../bot";

export async function updatesCommand(chatId: number) {
    for(let updateIndex = 0; updateIndex < updates.length; updateIndex++) {
        await bot.sendMessage(chatId, updates[updateIndex], {parse_mode: 'Markdown'})
    }
}
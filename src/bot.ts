import TelegramApi from 'node-telegram-bot-api'
import {token} from "./config/config";

export const bot = new TelegramApi(token as string, {polling: true})

module.exports = {
    bot
}
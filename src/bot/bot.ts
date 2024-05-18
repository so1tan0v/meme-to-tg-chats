import {token} from "../static";
import TelegramApi from 'node-telegram-bot-api'

export const bot = new TelegramApi(token as string, {polling: true})

module.exports = {
    bot
}
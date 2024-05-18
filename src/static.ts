import TelegramApi from "node-telegram-bot-api";

/**
 * Токен Telegram-бота
 * @type {string}
 */
export const token = process.env.TELEGRAM_TOKEN_API;
export const enableStats = process.env.ENABLE_STATS === 'true'
export const dataBaseLogging = process.env.DB_LOGGING === 'true'

/**
 * Первоначальные команды бота
 * @type {[{description: string, command: string},{description: string, command: string},{description: string, command: string},{description: string, command: string}]}
 */
export let botCommands: TelegramApi.BotCommand[] = [
    {command: '/start',    description: 'Начало работы с ботом'},
];
if(enableStats)
    botCommands.push({command: '/stats',    description: 'Статистика по мемам'})
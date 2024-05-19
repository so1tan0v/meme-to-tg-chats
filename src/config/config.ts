import TelegramApi from "node-telegram-bot-api";

/**
 * Telegram bot token
 */
export const token = process.env.TELEGRAM_TOKEN_API;

/**
 * Enables statistic module in bot. This statistic amounting count memes for each users
 */
export const enableStats: boolean = process.env.ENABLE_STATS === 'true'

/**
 * Enables database logging queries in console log
 */
export const dataBaseLogging: boolean = process.env.DB_LOGGING === 'true'


/**
 * Enables database logging queries in console log
 */
export const adminUserNames: string[] = process.env.ADMIN_USERNAMES ? process.env.ADMIN_USERNAMES.split(',').map(item => item.trim()) : []

/**
 * Reserved const
 */
export const START_COMMAND = '/start';
export const STATS_COMMAND = '/stats';
export const LAST_UPDATES_COMMAND = '/lastupdate'
export const ALL_UPDATE_COMMAND = '/allupdates'
export const WRITE_TO_ALL_USER = '/writetoalluser'
export const WRITE_TO_ALL_CHANNEL = '/writetoallchannel'
export const ALL_COMMANDS = '/allcommands';
export const REG_USERS = '/regusers'
export const ADDED_TO_CHANNELS = '/addedtochannels'

/**
 * Available commands in bot
 */
export let botCommands: TelegramApi.BotCommand[] = [
    {command: START_COMMAND,        description: 'Начало работы с ботом'},
    {command: LAST_UPDATES_COMMAND, description: 'Последнее обновление'},
    {command: ALL_UPDATE_COMMAND,   description: 'Все обновление, которые были произведены'},
    {command: ALL_COMMANDS,         description: 'Все комманды'},
];

if(enableStats)
    botCommands.push({command: STATS_COMMAND,    description: 'Статистика по мемам'});

export const adminBotCommand: TelegramApi.BotCommand[] = [
    {command: WRITE_TO_ALL_USER,    description: 'Написать всем пользователя, зарегистрированных в боте'},
    {command: WRITE_TO_ALL_CHANNEL, description: 'Написать всем пользователям, где добавлен бот в чаты'},
    {command: REG_USERS,            description: 'Все пользователи, где зарегистрирован бот'},
    {command: ADDED_TO_CHANNELS,    description: 'Все каналы, где добавлен бот'},
]
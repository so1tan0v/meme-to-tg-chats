/**
 * Токен Telegram-бота
 * @type {string}
 */
const token = process.env.TELEGRAM_TOKEN_API;
const enableStats = process.env.ENABLE_STATS === 'true'
const dataBaseLogging = process.env.DB_LOGGING === 'true'


/**
 * Первоначальные команды бота
 * @type {[{description: string, command: string},{description: string, command: string},{description: string, command: string},{description: string, command: string}]}
 */
let botCommands = [
    {command: '/start',    description: 'Начало работы с ботом'},
];
if(enableStats)
    botCommands.push({command: '/stats',    description: 'Статистика по мемам'})

module.exports = {
    enableStats,
    token,
    botCommands,
    dataBaseLogging
}
const dotenv = require('dotenv')
dotenv.config({
    path: process.env.NODE_ENV
        ? `.${process.env.NODE_ENV}.env`
        : '.env'
})

const {bot} = require("./src/app.telegram.js");
const {sequelize} = require("./src/database/db")
const {botCommands} = require('./src/static.js');
const messageController = require('./src/message/message.controller.js')
const {token} = require("./src/static");


const start = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (e) {
        throw e;
    }

    await bot.setMyCommands(botCommands);

    bot.on('message', async msg => {
        const chatId = msg.chat.id;

        try {
            return messageController(msg);
        } catch (e) {
            console.error(e)
            return bot.sendMessage(chatId, 'Произошел отвал, пиши @so1tan0v: ' + e)
        }
    })
}

start().then(() => console.log('Server starting with token ', token));



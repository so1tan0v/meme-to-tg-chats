import TelegramBot from "node-telegram-bot-api";
import {bot} from "../bot";
import {UsersService} from "../services/users.service";
import {isAdmin} from "../utils/helper";
import {it} from "node:test";
import {ChannelService} from "../services/channel.service";
import {adminBotCommand, botCommands} from "../config/config";

export async function allCommandsCommand(msg: TelegramBot.Message) {
    const chatId = msg?.chat?.id;

    let commands: string[] = botCommands.map(item => `${item.command} - ${item.description}`);

    if (msg.from?.username
        && isAdmin(msg.from.username)
    ) {
        commands = [...commands, ...adminBotCommand.map(item => `${item.command} - ${item.description}`)];
    }

    await bot.sendMessage(chatId, `*Команды*\n\n${commands.join(`\n`)}`, {parse_mode: "Markdown"})
}
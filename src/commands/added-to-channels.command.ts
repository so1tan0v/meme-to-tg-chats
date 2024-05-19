import TelegramBot from "node-telegram-bot-api";
import {bot} from "../bot";
import {UsersService} from "../services/users.service";
import {isAdmin} from "../utils/helper";
import {it} from "node:test";
import {ChannelService} from "../services/channel.service";

export async function addedToChannelsCommand(msg: TelegramBot.Message) {
    const chatId = msg?.chat?.id;

    if (msg.from?.username
        && isAdmin(msg.from.username)
    ) {
        const allChannels = await ChannelService.getAll();
        let channels: string[] = []
        allChannels.forEach(item => {
            channels.push(
                `*Id чата*: ${item.chatId} ` +
                `*Имя комнаты*: ${item.roomName} `
            )
        });
        await bot.sendMessage(chatId, `*Каналы:*\n\n${channels.join(`\n`)}\n\n *Количество*: ${channels.length}`, {parse_mode: 'Markdown'})
    } else {
        await bot.sendMessage(chatId, 'Эта команда не для вас.');
    }
}
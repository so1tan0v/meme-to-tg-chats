import {UsersService} from "../services/users.service";
import {bot} from "../bot";
import {ContentService} from "../services/content.service";
import TelegramBot from "node-telegram-bot-api";
import {startCommand} from "../commands/start.command";
import {statsCommand} from "../commands/stats.command";
import {lastUpdateCommand} from "../commands/last-update.command";
import {updatesCommand} from "../commands/updates.command";
import {
    ADDED_TO_CHANNELS, ALL_COMMANDS,
    ALL_UPDATE_COMMAND,
    LAST_UPDATES_COMMAND, REG_USERS,
    START_COMMAND,
    STATS_COMMAND, WRITE_TO_ALL_CHANNEL, WRITE_TO_ALL_USER,
} from "../config/config";
import {downloadCommand} from "../commands/download.command";
import {writeToAllUsersCommand} from "../commands/write-to-all-users.command";
import {writeToAllChannelsCommand} from "../commands/write-to-all-channels.command";
import {allCommandsCommand} from "../commands/all-commands.command";
import {addedToChannelsCommand} from "../commands/added-to-channels.command";
import {regUsersCommand} from "../commands/reg-users.command";

export async function localChatController(msg: TelegramBot.Message) {
    const text   = msg.text;
    const chatId = msg?.from?.id;

    if(!chatId)
        return;

    let user = await UsersService.getByChatId(chatId);

    if(!user) {
        await UsersService.create({
            chatId: chatId,
            username: msg.chat.username ?? 'Отсутствует',
            lastName: msg.chat.last_name ?? 'Отсутствует',
            firstName: msg.chat.first_name ?? 'Отсутствует',
        });
    }
    const firstPrefix = text?.split(' ')[0];
    switch (firstPrefix) {
        case START_COMMAND:
            await startCommand(chatId);
            return;
        case STATS_COMMAND:
            await statsCommand(chatId);
            return;
        case LAST_UPDATES_COMMAND:
            await lastUpdateCommand(chatId);
            return;
        case ALL_UPDATE_COMMAND:
            await updatesCommand(chatId);
            return;
        case WRITE_TO_ALL_USER:
            await writeToAllUsersCommand(msg)
            return;
        case WRITE_TO_ALL_CHANNEL:
            await writeToAllChannelsCommand(msg)
            return;
        case REG_USERS:
            await regUsersCommand(msg);
            return;
        case ADDED_TO_CHANNELS:
            await addedToChannelsCommand(msg)
            return;
        case ALL_COMMANDS:
            await allCommandsCommand(msg);
            return;
        default:
            await bot.sendMessage(chatId, 'Общий чат отключен')
            // await downloadCommand(msg, true)
            return;
    }
}
import Channels, {ChannelAttributes} from "../database/models/Channals";

export class ChannelService {
    public data;
    constructor(channel: Channels) {
        this.data = channel;
    }

    async update(params: Channels) {
        this.data = await this.data.update(params);
    }

    static async getById (id: number) {
        let channel = await Channels.findOne({where: {id: id}})

        return channel
            ? new ChannelService(channel)
            : null
    }

    static async getByChatId (chatId: number) {
        let channel = await Channels.findOne({where: {chatId: chatId}})

        return channel
            ? new ChannelService(channel)
            : null
    }

    static async getAll () {
        return await Channels.findAll();
    }

    static async create(params: ChannelAttributes) {
        let channel = await Channels.create(params as Omit<Channels, 'id'>)

        return new ChannelService(channel);
    }
}
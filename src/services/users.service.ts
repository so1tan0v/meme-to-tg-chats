import Users, {UserAttributes} from "../database/models/Users";

export class UsersService {
    public data;
    constructor(client: Users) {
        this.data = client;
    }

    async update(params: Users) {
        this.data = await this.data.update(params);
    }

    static async getById (id: number) {
        let client = await Users.findOne({where: {id: id}})

        return client
            ? new UsersService(client)
            : null
    }

    static async getByChatId (chatId: number) {
        let client = await Users.findOne({where: {chatId: chatId}})

        return client
            ? new UsersService(client)
            : null
    }

    static async getAllUsers () {
        return await Users.findAll();
    }

    static async create(params: UserAttributes) {
        let client = await Users.create(params as Omit<Users, 'id'>)

        return new UsersService(client);
    }
}
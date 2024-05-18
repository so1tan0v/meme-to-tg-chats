const {Users: userModels } = require('../database/models.js')

class Users {
    constructor(client) {
        this.data = client;
    }

    async update(params) {
        this.data = await this.data.update(params);
    }

    static async getById (id) {
        let client = await userModels.findOne({where: {id: id}})

        return client
            ? new Users(client)
            : null
    }

    static async getByChatId (chatId) {
        let client = await userModels.findOne({where: {chatId: chatId}})

        return client
            ? new Users(client)
            : null
    }

    static async getAllUsers () {
        return await userModels.findAll();
    }

    static async create(params) {
        let client = await userModels.create(params)

        return new Users(client);
    }


}

module.exports = {Users}
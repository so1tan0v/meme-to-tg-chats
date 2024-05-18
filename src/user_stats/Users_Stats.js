const {Users_Stats: userStatsModels, Users: userModel } = require('../database/models.js')
const {sequelize} = require("../database/db");

class Users_Stats {
    constructor(user_stats) {
        this.data = user_stats;
    }

    async update(params) {
        this.data = await this.data.update(params);
    }

    static async getById (id) {
        let user_stats = await userStatsModels.findOne({where: {id: id}})

        return user_stats
            ? new Users_Stats(user_stats)
            : null
    }

    static async getAll () {

        return await userStatsModels.findAll({
            group: 'user_id'
        });
    }

    static async getAllStatsWithUser() {
        return await userModel.findAll({
            include: [{
                model: userStatsModels,
                attributes: [[sequelize.fn('COUNT', sequelize.col('Users_Stats.id')), 'statsCount']] // Вычисляем количество связанных записей в Users_Stats
            }],
            group: ['Users.id'] // Группируем результат по идентификатору пользователя, чтобы избежать дублирования пользователей
        })

    }

    static async create(params) {
        let user_stats = await userStatsModels.create(params)

        return new Users_Stats(user_stats);
    }


}

module.exports = {Users_Stats}
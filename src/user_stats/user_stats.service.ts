import Users_Stats, {UsersStatsCreationAttributes} from "../database/models/Users_Stats";
import Users from "../database/models/Users";
import sequelize from "sequelize";

export class UsersStatsService {
    private data: Users_Stats;
    constructor(user_stats: Users_Stats) {
        this.data = user_stats;
    }

    async update(params: Users_Stats) {
        this.data = await this.data.update(params);
    }

    static async getById (id: number) {
        let user_stats = await Users_Stats.findOne({where: {id: id}})

        return user_stats
            ? new UsersStatsService(user_stats)
            : null
    }

    static async getAll () {

        return await Users_Stats.findAll({
            group: 'user_id'
        });
    }

    static async getAllStatsWithUser() {
        return await Users.findAll({
            include: [{
                model: Users_Stats,
                attributes: [[sequelize.fn('COUNT', sequelize.col('Users_Stats.id')), 'statsCount']] // Вычисляем количество связанных записей в Users_Stats
            }],
            group: ['Users.id'] // Группируем результат по идентификатору пользователя, чтобы избежать дублирования пользователей
        })

    }

    static async create(params: UsersStatsCreationAttributes) {
        let user_stats = await Users_Stats.create(params)

        return new UsersStatsService(user_stats);
    }
}
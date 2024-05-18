import { Model, DataTypes, Optional, BelongsTo } from 'sequelize';
import { sequelize } from '../db';
import Users from "./Users";

export interface UsersStatsAttributes {
    id: number;
    user_id: number;
    url: string;
}
export interface UsersStatsCreationAttributes extends Optional<UsersStatsAttributes, 'id'> {}

class Users_Stats extends Model<UsersStatsAttributes, UsersStatsCreationAttributes> implements UsersStatsAttributes {
    public id!: number;
    public user_id!: number;
    public url!: string;
    static Users: BelongsTo<Users_Stats, Users>;
}

Users_Stats.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        comment: 'Идентификатор записи'
    },
    user_id: {
        type: DataTypes.NUMBER,
        comment: 'Идентификатор пользователя',
        references: {
            model: Users,
            key: 'id'
        }
    },
    url: {
        type: DataTypes.STRING,
        comment: 'URL до мема'
    }
}, {
    sequelize,
    tableName: 'Users_Stats',
    timestamps: true,
    comment: 'Статистика пользователей',
});

// Users_Stats.Users = Users_Stats.belongsTo(Users)

export default Users_Stats;

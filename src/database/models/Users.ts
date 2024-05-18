import { Model, DataTypes, Optional, HasMany } from 'sequelize';
import { sequelize } from '../db';
import Users_Stats from "./Users_Stats";
import {UsersStatsService} from "../../user_stats/user_stats.service";

export interface UserAttributes {
    Users_Stats?: UsersStatsService;
    id?: number;
    chatId: number;
    lastName: string;
    firstName: string;
    username: string;
}
export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class Users extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public chatId!: number;
    public lastName!: string;
    public firstName!: string;
    public username!: string;
    static Users_Stats: HasMany<Users, Users_Stats>;
}

Users.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        comment: 'Идентификатор записи'
    },
    chatId: {
        type: DataTypes.NUMBER,
        unique: true,
        comment: 'Идентификатор чата'
    },
    lastName: {
        type: DataTypes.STRING,
        comment: 'Имя пользователя'
    },
    firstName: {
        type: DataTypes.STRING,
        comment: 'Фамилия пользователя'
    },
    username: {
        type: DataTypes.STRING,
        comment: 'Идентификатор пользователя в Telegram'
    }
}, {
    sequelize,
    tableName: 'Users',
    timestamps: true,
    comment: 'Пользователи, работающие с ботом'
});

Users.Users_Stats = Users.hasMany(Users_Stats, { foreignKey: 'user_id' });

export default Users;

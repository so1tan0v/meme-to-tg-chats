import { Model, DataTypes, Optional, HasMany } from 'sequelize';
import { sequelize } from '../db';

export interface ChannelAttributes {
    id?: number;
    chatId: number
    roomName: string
}
export interface ChannelCreationAttributes extends Optional<ChannelAttributes, 'id'> {}

class Channels extends Model<ChannelAttributes, ChannelCreationAttributes> implements ChannelAttributes {
    public id!: number;
    public chatId!: number;
    public roomName!: string
}

Channels.init({
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
    roomName: {
        type: DataTypes.STRING,
        comment: 'Имя пользователя'
    },
}, {
    sequelize,
    tableName: 'Channels',
    timestamps: true,
    comment: 'Каналы, где добавлен бот'
});

export default Channels;

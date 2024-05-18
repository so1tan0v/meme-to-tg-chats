const { sequelize } = require("./db");
const {DataTypes} = require("sequelize")

const Users = sequelize.define('Users', {
    id        : {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true, comment: 'Идентификатор записи'},
    chatId    : {type: DataTypes.STRING,  unique: true, index: 'client_chat_id',               comment: 'Идентификатор чата'},
    lastName  : {type: DataTypes.STRING,                                                       comment: 'Имя пользователя'},
    firstName : {type: DataTypes.STRING,                                                       comment: 'Фамилия пользователя'},
    username  : {type: DataTypes.STRING,                                                       comment: 'Идентификатор пользователя в Telegram'}
}, {
    timestamps : true,
    comment    : 'Пользователи, работающие с ботом'
})

const Users_Stats = sequelize.define('Users_Stats', {
    id        : {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true, comment: 'Идентификатор записи'},
    user_id   : {type: DataTypes.STRING, index: 'us_user_id',                                  comment: 'Идентификатор чата'},
    url       : {type: DataTypes.STRING,                                                       comment: 'URL до мема'},
}, {
    timestamps : true,
    comment    : 'Пользователи, зарегистрированные в системе розыгрышей'
})

Users.hasMany(Users_Stats, { foreignKey: 'user_id' }); // Одному пользователю соответствует много записей в Users_Stats
Users_Stats.belongsTo(Users, { foreignKey: 'user_id' }); // Каждая запись в Users_Stats принадлежит одному пользователю


module.exports = {
    Users,
    Users_Stats
};
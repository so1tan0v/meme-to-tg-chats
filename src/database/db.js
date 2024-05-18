const {Sequelize} = require("sequelize");
const {dataBaseLogging} = require("../static");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/database.sqlite',
    sync: true,
    logging: dataBaseLogging
});

module.exports = {
    sequelize
}
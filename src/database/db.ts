import {Sequelize} from "sequelize";
import {dataBaseLogging} from "../config/config";

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/database.sqlite',
    logging: dataBaseLogging
        ? console.log
        : false
});


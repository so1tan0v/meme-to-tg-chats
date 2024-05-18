import {Sequelize} from "sequelize";
import {dataBaseLogging} from "../static";

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/database.sqlite',
    logging: dataBaseLogging
        ? console.log
        : false
});


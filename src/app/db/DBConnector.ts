import { Sequelize } from 'sequelize';
import { DB_DATABASE, DB_USER, DB_HOST, DB_PASSWORD, DB_PORT } from '../../config';

const dbConnector = new Sequelize(
    `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?charset=utf8mb4`,
);

export default dbConnector;

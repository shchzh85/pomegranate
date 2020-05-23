import { Sequelize } from 'sequelize-typescript';
import path from 'path';

const DB_HOST = process.env.MYSQL_HOST || 'db';
const DB_PORT = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306;
const DB_USERNAME = process.env.MYSQL_USERNAME || 'root';
const DB_PASSWORD = process.env.MYSQL_PASSWORD || '123456';
const DB_NAME = process.env.MYSQL_DATABASE || 'ant';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,

  models: [path.join(__dirname, '../../models/**/*.model.js')],
  modelMatch: (filename, member) => {
    const name = filename.replace('.model', '_model');
    const model = member.replace(/([A-Z])/g, '_$1').toLowerCase().substring(1);
    return name === model;
  },

  define: {
    timestamps: false,
    paranoid: false,
    underscored: true,
    charset: 'utf8',
    initialAutoIncrement: '1000',
  },

  pool: {
    max: 5,
    min: 0,
    acquire: 300000,
    idle: 10000,
  },

  dialectOptions: {
    decimalNumbers: true,
  },

  timezone: '+08:00',
  repositoryMode: true,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export { sequelize };

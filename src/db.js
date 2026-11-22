import path from 'path';
import { Sequelize } from 'sequelize';


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(import.meta.dirname, '..', 'users.sqlite'),
  logging: false
});

export default sequelize;


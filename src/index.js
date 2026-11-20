import 'dotenv/config'; //подключаем библиотеку dotenv, которая подгружает пароли из envб вход!!!
import app from './app.js'; 

require('dotenv').config();

const sequelize = require('./db');
const PORT = process.env.PORT || 3000; //к какому порту подключаться

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log('SQLite подключена.');
    console.log('Таблица users готова.');

    app.listen(PORT, () => {
      console.log(`Сервер запущен: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка запуска приложения:', error);
    process.exitCode = 1;
  }
}

start();
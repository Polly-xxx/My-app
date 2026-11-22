import 'dotenv/config';
import app from './app.js';
import sequelize from './db.js';

const PORT = process.env.PORT || 3000;

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

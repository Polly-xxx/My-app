import express from 'express';
import { engine } from 'express-handlebars';
import hbs from 'hbs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import tasksRouter from './routes/tasks.js';
import authRouter from './routes/auth.js';
import { getProducts, getProductById } from './controllers/productController.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = [];

// Глобальный Логирующий Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware для парсинга JSON, данных с HTML-форм и статики
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// --- НАСТРОЙКА ШАБЛОНИЗАТОРА ---
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    extname: 'handlebars'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Регистрация partials элементов
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// --- МАРШРУТЫ ---
app.get('/', (req, res) => {
    res.render('home', { title: 'Главная страница' });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'О нас',
        description: 'Мы лучший интернет-магазин на Express.js!'
    });
});

// Маршруты товаров
app.get('/products', getProducts);
app.get('/products/:id', getProductById);

// Подключаем роутер задач
app.use('/tasks', tasksRouter);

// Подключаем наш роутер авторизации
app.use('/auth', authRouter);

app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password
    );
  
    if (!user) {
      return res.render('login', {
        title: 'Вход',
        error: 'Неверный email или пароль.',
      });
    }
  
    req.session.user = {
      username: user.username,
      email: user.email,
    };
  
    res.redirect('/');
});
  
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
});

// Оставляем ОДИН export default в самом конце
export default app;

// оператор — это специальный символ или ключевое слово, которое выполняет какое-то действие над данными
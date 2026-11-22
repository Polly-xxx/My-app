import express from 'express';
import { engine } from 'express-handlebars';
import hbs from 'hbs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import tasksRouter from './routes/tasks.js';
import authRouter from './routes/auth.js';
import { getProducts, getProductById } from './controllers/productController.js';
import User from './models/Users.js';


dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

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

// Подключаем роутеры
app.use('/tasks', tasksRouter);
app.use('/auth', authRouter);

// --- РАБОТА С ПОЛЬЗОВАТЕЛЯМИ В БАЗЕ ДАННЫХ ---


app.get('/users', async (req, res) => {
    try {
        const usersFromDb = await User.findAll({ raw: true });
        res.render('users', {
            title: 'Список пользователей',
            users: usersFromDb
        });
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        res.status(500).send('Ошибка сервера при загрузке пользователей');
    }
});

// Регистрация нового пользователя 
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Проверяем, не занят ли email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).render('register', {
                title: 'Регистрация',
                error: 'Пользователь с таким email уже существует.'
            });
        }

        // 2. Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Записываем пользователя в базу данных
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // 4. Сохраняем в сессию  и перенаправляем
        if (req.session) {
            req.session.user = {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            };
        }

        res.redirect('/users');
    } catch (error) {
        console.error('Ошибка при записи пользователя в БД:', error);
        res.status(500).render('register', {
            title: 'Регистрация',
            error: 'Не удалось зарегистрировать пользователя. Проверьте введённые данные.'
        });
    }
});

// Вход пользователя с проверкой по БД
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.render('login', {
                title: 'Вход',
                error: 'Неверный email или пароль.'
            });
        }

        // Сравниваем введённый пароль с хешем из базы
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render('login', {
                title: 'Вход',
                error: 'Неверный email или пароль.'
            });
        }

        if (req.session) {
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email
            };
        }

        res.redirect('/');
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).render('login', {
            title: 'Вход',
            error: 'Ошибка сервера при попытке входа.'
        });
    }
});

app.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
});

export default app;

// оператор — это специальный символ или ключевое слово, которое выполняет какое-то действие над данными
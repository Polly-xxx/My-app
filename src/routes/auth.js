import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/Users.js';

const router = express.Router();

// Страница регистрации
router.get('/register', (req, res) => {
    res.render('register', { title: 'Регистрация' });
});

// Обработка регистрации (запись в БД через try/catch)
router.post('/register', async (req, res) => {
    try {
        const { firstName, name, username, email, password } = req.body;
        const userNameValue = (username || firstName || name || '').trim();

        if (!userNameValue || !email || !password) {
            return res.status(400).render('register', {
                title: 'Регистрация',
                error: 'Пожалуйста, заполните все поля.'
            });
        }

        // Проверяем, не занят ли email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).render('register', {
                title: 'Регистрация',
                error: 'Пользователь с таким email уже существует.'
            });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Записываем пользователя в базу данных
        const newUser = await User.create({
            username: userNameValue,
            email,
            password: hashedPassword
        });

        // Сохраняем в сессию, если она подключена
        if (req.session) {
            req.session.user = {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            };
        }

        res.redirect('/');

    } catch (error) {
        console.error('Ошибка при записи пользователя в БД:', error);
        res.status(500).render('register', {
            title: 'Регистрация',
            error: 'Не удалось зарегистрировать пользователя.'
        });
    }
});

// Страница входа
router.get('/login', (req, res) => {
    res.render('login', { title: 'Вход' });
});

// Обработка входа
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.render('login', {
                title: 'Вход',
                error: 'Неверный email или пароль.'
            });
        }

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

// Выход
router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect('/auth/login');
        });
    } else {
        res.redirect('/auth/login');
    }
});

export default router;

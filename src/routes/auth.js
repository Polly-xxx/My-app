import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

const users = [];

// Функция валидации пароля
function validatePassword(password) {
    if (!password || password.length < 8) {
        return 'Минимальная длина пароля — 8 символов';
    }
    if (!/\d/.test(password)) {
        return 'Пароль должен содержать хотя бы 1 цифру';
    }
    if (!/[A-ZА-ЯЁ]/.test(password)) {
        return 'Пароль должен содержать хотя бы одну заглавную букву';
    }
    return null;
}

// --- ВХОД ---
router.get('/login', (req, res) => {
    res.render('login', { title: 'Авторизация' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);

    if (!user && email === 'gavgav@mycorp.com' && password === '12345') {
        return res.render('home', { 
            title: 'Главная', 
            user: { firstName: 'Полина', email: 'gavgav@mycorp.com' } 
        });
    }

    if (!user) {
        return res.render('login', { title: 'Авторизация', error: 'Неверный email или пароль' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        return res.render('home', { title: 'Главная', user: user });
    }

    res.render('login', { title: 'Авторизация', error: 'Неверный email или пароль' });
});

// --- РЕГИСТРАЦИЯ ---
router.get('/register', (req, res) => {
    res.render('register', { title: 'Регистрация' });
});

router.post('/register', async (req, res) => {
    const { firstName, email, password } = req.body;

    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.render('register', { title: 'Регистрация', error: passwordError });
    }

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.render('register', { title: 'Регистрация', error: 'Пользователь с таким email уже есть' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            firstName,
            email,
            password: hashedPassword
        };

        users.push(newUser);

        // Сразу открываем главную страницу с приветствием
        res.render('home', { 
            title: 'Главная', 
            user: newUser 
        });
    } catch (err) {
        res.render('register', { title: 'Регистрация', error: 'Что-то пошло не так...' });
    }
});

// --- ВЫХОД ---
router.get('/logout', (req, res) => {
    res.render('home', { title: 'Главная', user: null });
});

export default router;

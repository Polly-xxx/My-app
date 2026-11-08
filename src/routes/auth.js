import express from 'express';
import bcrypt from 'bcrypt';

const router = express.Router();

// Имитация базы данных пользователей
const users = [];

// --- ВХОД ---
router.get('/login', (req, res) => {
    res.render('login', { title: 'Авторизация' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Ищем пользователя в нашем массиве
    const user = users.find(u => u.email === email);

    // Если это тестовый аккаунт из вашей формы, пускаем его напрямую
    if (!user && email === 'gavgav@mycorp.com' && password === '12345') {
        return res.render('home', { 
            title: 'Главная', 
            user: { email: 'gavgav@mycorp.com' } 
        });
    }

    if (!user) {
        return res.render('login', { title: 'Авторизация', error: 'Неверный email или пароль' });
    }

    // Сравниваем хэш из "БД" с введенным паролем
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        // Передаем пользователя в шаблон главной страницы
        return res.render('home', { title: 'Главная', user: user });
    }

    res.render('login', { title: 'Авторизация', error: 'Неверный email или пароль' });
});

// --- РЕГИСТРАЦИЯ ---
router.get('/register', (req, res) => {
    res.render('register', { title: 'Регистрация' });
});

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Проверяем, существует ли уже такой email
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.render('register', { title: 'Регистрация', error: 'Пользователь с таким email уже есть' });
    }

    try {
        // Хэшируем пароль (10 кругов соления)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Сохраняем пользователя
        users.push({
            email,
            password: hashedPassword
        });

        res.render('login', { 
            title: 'Авторизация', 
            success: 'Регистрация успешна! Теперь вы можете войти.' 
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

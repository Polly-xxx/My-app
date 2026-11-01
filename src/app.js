import express from 'express';
import { engine } from 'express-handlebars';
import hbs from 'hbs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Импорт роутеров
import tasksRouter from './routes/tasks.js';
import { getProducts, getProductById } from './src/src/controllers/productController.js'; // импорт контроллера товаров

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Глобальный Логирующий Middleware (Презентация 4)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware для чтения JSON и статики
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Настройка шаблонизатора Handlebars (Презентация 1, 3)
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'src/views/layouts'),
    partialsDir: path.join(__dirname, 'src/views/partials'),
    extname: 'handlebars'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

// Регистрация папки partials через hbs-модуль
hbs.registerPartials(path.join(__dirname, 'src/views/partials'));

// --- МАРШРУТЫ ИНТЕРНЕТ-МАГАЗИНА (Презентация 3) ---

// Главная страница
app.get('/', (req, res) => {
    res.render('home', { title: 'Главная страница' });
});

// Страница "О нас" с передачей переменных
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'О нас',
        description: 'Мы лучший интернет-магазин на Express.js!'
    });
});

// Страница каталога товаров и конкретного товара
app.get('/products', getProducts);
app.get('/products/:id', getProductById);

// --- СЛОЙ АРХИТЕКТУРЫ: ТАБЛИЦА ЗАДАЧ (Презентация 2) ---
app.use('/tasks', tasksRouter);

app.get("/login", (req, res) => {
    res.render("login", {
        login: "Polly",
        status: "Online",
        description: "My page"
    });
});


// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер успешно запущен на порту ${PORT}`);
});



// оператор — это специальный символ или ключевое слово, которое выполняет какое-то действие над данными
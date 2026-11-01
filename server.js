const express = require("express");

const app = express();

// Главная страница
app.get("/", (req, res) => {
  res.send("Главная страница");
});

// Страница "О компании"
app.get("/about", (req, res) => {
  res.send("Информация о компании");
});

// Получить список товаров
app.get("/products", (req, res) => {
  res.send("Список товаров");
});

// Создать новый товар
app.post("/products", (req, res) => {
  res.send("Товар создан");
});

// Удалить товары
app.delete("/products", (req, res) => {
  res.send("Удалить товары");
});

// Запуск сервера на порту 3000
app.listen(3000, () => {
  console.log("Server started on port 3000");
});

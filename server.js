import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Главная страница");
});

app.get("/about", (req, res) => {
  res.send("Информация о компании");
});

app.get("/products", (req, res) => {
  res.send("Список товаров");
});

app.post("/products", (req, res) => {
  res.send("Товар создан");
});

app.delete("/products", (req, res) => {
  res.send("Удалить товары");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

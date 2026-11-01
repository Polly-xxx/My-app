import 'dotenv/config'; //подключаем библиотеку dotenv, которая подгружает пароли из envб вход!!!
import app from './app.js'; 


const PORT = process.env.PORT || 3000; //к какому порту подключаться

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

// Подключаем базу данных SQLite
const db = new sqlite3.Database("./database.db", err => {
  if (err) console.error("Ошибка подключения:", err.message);
  else console.log("✅ Подключено к SQLite");
});

// Поддержка JSON и form-urlencoded
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Настраиваем сессии
app.use(
  session({
    secret: "super_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Подключаем статику
app.use(express.static(path.join(__dirname, "public")));

// Создаем таблицу пользователей
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    password TEXT
  )
`);

// 📌 Отдаём HTML-страницу
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 📌 Регистрация пользователя
app.post("/register", (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) return res.json({ error: "⚠️ Введите имя и пароль!" });

  db.get("SELECT * FROM users WHERE name = ?", [name], (err, user) => {
    if (err) return res.json({ error: "Ошибка запроса" });
    if (user) return res.json({ error: "⚠️ Пользователь уже существует!" });

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.json({ error: "Ошибка хэширования" });

      db.run("INSERT INTO users (name, password) VALUES (?, ?)", [name, hash], function (err) {
        if (err) return res.json({ error: "Ошибка регистрации" });
        req.session.user = { id: this.lastID, name };
        res.json({ message: "✅ Регистрация успешна!", user: req.session.user });
      });
    });
  });
});

// 📌 Вход пользователя
app.post("/login", (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) return res.json({ error: "⚠️ Введите имя и пароль!" });

  db.get("SELECT * FROM users WHERE name = ?", [name], (err, user) => {
    if (err || !user) return res.json({ error: "⚠️ Неверные данные!" });

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) return res.json({ error: "⚠️ Неверные данные!" });

      req.session.user = { id: user.id, name: user.name };
      res.json({ message: "✅ Вход выполнен!", user: req.session.user });
    });
  });
});

// 📌 Проверка текущего пользователя
app.get("/current-user", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
});

// 📌 Выход из аккаунта
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "🚪 Вы вышли из аккаунта!" });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});

import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"; // Добавляем JWT
import dotenv from "dotenv";

dotenv.config(); // Для хранения секретных ключей

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/Registration");

// Модель пользователя
const UserSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: { type: String, unique: true },
  password: String, // Можно добавить для доп. защиты
});

const User = mongoose.model("User", UserSchema);

// Модель для хранения кодов подтверждения
const CodeSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date,
});

const Code = mongoose.model("Code", CodeSchema);

// Генерация случайного кода
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Конфигурация почтового сервера
const transporter = nodemailer.createTransport({
  service: "yandex",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Отправка кода на email
async function sendVerificationEmail(email, code) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Подтверждение почты",
    text: `Ваш код для входа: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Код отправлен на почту:", email);
  } catch (error) {
    console.error("Ошибка отправки email:", error);
  }
}

// Запрос кода на email
app.post("/send-code", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email не указан" });
  }

  const code = generateCode();

  // Сохраняем код в базе данных
  await Code.findOneAndUpdate(
    { email },
    { code, expiresAt: new Date(Date.now() + 5 * 60 * 1000) }, // Код действует 5 минут
    { upsert: true }
  );

  await sendVerificationEmail(email, code);
  res.json({ message: "Код отправлен" });
});

// Проверка кода и генерация JWT
app.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;
  
  if (!email || !code) {
    return res.status(400).json({ error: "Email и код обязательны" });
  }

  const foundCode = await Code.findOne({ email });

  if (!foundCode || foundCode.code !== code || foundCode.expiresAt < new Date()) {
    return res.status(400).json({ error: "Неверный или истекший код" });
  }

  // Проверяем, зарегистрирован ли пользователь
  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ email, name: req.body.name, surname: req.body.surname });
    await user.save();
  }

  // Генерируем JWT
  const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Успешная авторизация", token });
});

// Middleware для защиты маршрутов
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Нет доступа" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Неверный токен" });
    req.user = user;
    next();
  });
}

// Защищенный маршрут
app.get("/profile", authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ email: user.email, name: user.name, surname: user.surname });
});

app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});

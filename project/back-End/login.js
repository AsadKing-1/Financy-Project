// Импортируем bcryptjs
import bcrypt from 'bcryptjs';

// Обработчик для кнопки регистрации
document.querySelector("#Register").addEventListener("click", async () => {
    const Login = document.querySelector("#LoginInput");
    const Password = document.querySelector("#PasswordInput");

    if (Login.value === '' || Password.value === '') {
        alert("Error: Поля не могут быть пустыми!");
    } else {
        try {
            // Хэшируем пароль
            const salt = bcrypt.genSaltSync(10); // Генерация "соли"
            const hashedPassword = bcrypt.hashSync(Password.value, salt); // Хэширование пароля

            // Отправляем данные на сервер
            const response = await fetch("http://localhost:3000/users", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: Login.value,
                    password: hashedPassword, // Отправляем хэшированный пароль
                })
            });

            const dataServer = await response.json();
            console.log("Регистрация успешна:", dataServer);
        } catch (er) {
            console.error("Ошибка при регистрации:", er);
        }
    }
});

// Функция для получения данных о пользователях
function LogIn() {
    fetch("http://localhost:3000/users", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
        })
        .then(data => {
            console.log("Ваши логины:", data);
        })
        .catch(error => {
            console.error("Произошла ошибка:", error);
        });
}

LogIn();
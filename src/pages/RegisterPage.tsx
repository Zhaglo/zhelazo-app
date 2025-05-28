import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { username, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

        const userExists = existingUsers.find((user: any) => user.email === email);
        if (userExists) {
            setError("Пользователь с таким email уже существует");
            return;
        }

        const newUser = { id: Date.now(), username, email, password };
        localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));
        localStorage.setItem("token", String(newUser.id)); // "авторизуем" сразу

        navigate("/dashboard");
    };

    return (
        <div>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <input name="username" placeholder="Имя" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Пароль" onChange={handleChange} required />
                <input name="confirmPassword" type="password" placeholder="Повторите пароль" onChange={handleChange} required />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default RegisterPage;
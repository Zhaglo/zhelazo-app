import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import styles from "./AuthForm.module.scss";

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
        localStorage.setItem("token", String(newUser.id));
        navigate("/dashboard");
    };

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    name="username"
                    placeholder="Имя"
                    onChange={handleChange}
                    required
                />
                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="Пароль"
                    onChange={handleChange}
                    required
                />
                <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Повторите пароль"
                    onChange={handleChange}
                    required
                />
                {error && <p className={styles.error}>{error}</p>}
                <Button type="submit">Зарегистрироваться</Button>
            </form>
        </div>
    );
};

export default RegisterPage;
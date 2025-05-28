import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import styles from "./AuthForm.module.scss";

const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const RegisterPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [touched, setTouched] = useState({
        username: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({
            username: true,
            email: true,
            password: true,
            confirmPassword: true,
        });

        const { username, email, password, confirmPassword } = formData;

        if (!username || !isValidEmail(email) || !password || !confirmPassword) {
            setError("Пожалуйста, заполните все поля корректно");
            return;
        }

        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            setFormData((prev) => ({ ...prev, confirmPassword: "" }));
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

            <form onSubmit={handleSubmit} className={styles.formWrapper}>
                <div className={styles.formGroup}>
                    <Input
                        name="username"
                        placeholder="Имя"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={
                            touched.username && !formData.username ? styles.inputError : ""
                        }
                    />
                    <div
                        className={`${styles.helperText} ${
                            touched.username && !formData.username ? styles.visible : ""
                        }`}
                    >
                        Введите имя
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={
                            touched.email && !isValidEmail(formData.email)
                                ? styles.inputError
                                : ""
                        }
                    />
                    <div
                        className={`${styles.helperText} ${
                            touched.email && !isValidEmail(formData.email)
                                ? styles.visible
                                : ""
                        }`}
                    >
                        Введите корректный email
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <Input
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={
                            touched.password && !formData.password
                                ? styles.inputError
                                : ""
                        }
                    />
                    <div
                        className={`${styles.helperText} ${
                            touched.password && !formData.password ? styles.visible : ""
                        }`}
                    >
                        Введите пароль
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <Input
                        name="confirmPassword"
                        type="password"
                        placeholder="Повторите пароль"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={
                            touched.confirmPassword && !formData.confirmPassword
                                ? styles.inputError
                                : ""
                        }
                    />
                    <div
                        className={`${styles.helperText} ${
                            touched.confirmPassword && !formData.confirmPassword
                                ? styles.visible
                                : ""
                        }`}
                    >
                        Повторите пароль
                    </div>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" className="btn btn-primary">
                    Зарегистрироваться
                </button>
            </form>

            <p className={styles.linkPrompt}>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
        </div>
    );
};

export default RegisterPage;
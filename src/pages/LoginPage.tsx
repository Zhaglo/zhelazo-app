import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import styles from "./AuthForm.module.scss";

const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
        email: false,
        password: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ email: true, password: true });

        if (!isValidEmail(formData.email)) {
            setError("Некорректный email");
            return;
        }

        if (!formData.password) {
            setError("Введите пароль");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const foundUser = users.find(
            (user: any) =>
                user.email === formData.email && user.password === formData.password
        );

        if (!foundUser) {
            setError("Неверный email или пароль");

            // 👇 Очищаем только поле пароля
            setFormData((prev) => ({ ...prev, password: "" }));

            return;
        }

        localStorage.setItem("token", String(foundUser.id));
        navigate("/dashboard");
    };

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Вход</h2>

            <form onSubmit={handleSubmit} className={styles.formWrapper}>
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
                            touched.email && !isValidEmail(formData.email) ? styles.visible : ""
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

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" className="btn btn-primary">
                    Войти
                </button>
            </form>

            <p className={styles.linkPrompt}>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
};

export default LoginPage;
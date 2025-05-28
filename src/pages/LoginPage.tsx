import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { email, password } = formData;
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

        const foundUser = existingUsers.find(
            (user: any) => user.email === email && user.password === password
        );

        if (!foundUser) {
            setError("Неверный email или пароль");
            return;
        }

        localStorage.setItem("token", String(foundUser.id));
        navigate("/dashboard");
    };

    return (
        <div>
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Пароль"
                    onChange={handleChange}
                    required
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default LoginPage;
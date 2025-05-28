import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}

const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        const currentUser = users.find((u: User) => String(u.id) === token);
        setUser(currentUser || null);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!user) {
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <h2>Профиль</h2>
            <p><strong>Имя:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={handleLogout}>Выйти</button>
        </div>
    );
};

export default ProfilePage;
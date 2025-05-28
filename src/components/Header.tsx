import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                backgroundColor: "#007bff",
                color: "#fff",
            }}
        >
            <nav style={{ display: "flex", gap: "1rem" }}>
                <NavLink to="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>
                    Главная
                </NavLink>
                <NavLink to="/stats" style={{ color: "#fff", textDecoration: "none" }}>
                    Статистика
                </NavLink>
                <NavLink to="/motivation" style={{ color: "#fff", textDecoration: "none" }}>
                    Мотивация
                </NavLink>
                <NavLink to="/profile" style={{ color: "#fff", textDecoration: "none" }}>
                    Профиль
                </NavLink>
            </nav>
            <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #fff", color: "#fff", padding: "0.5rem 1rem", borderRadius: "4px" }}>
                Выйти
            </button>
        </header>
    );
};

export default Header;
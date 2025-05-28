import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                    Главная
                </NavLink>
                <NavLink to="/stats" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                    Статистика
                </NavLink>
                <NavLink to="/motivation" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                    Мотивация
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                    Профиль
                </NavLink>
            </nav>
            <button className="btn btn-outline-light" onClick={handleLogout}>Выйти</button>
        </header>
    );
};

export default Header;
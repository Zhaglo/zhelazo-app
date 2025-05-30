import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";

const Header = () => {

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
        </header>
    );
};

export default Header;
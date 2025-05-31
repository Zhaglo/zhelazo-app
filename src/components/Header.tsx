import { NavLink } from "react-router-dom";
import logo from "../assets/logo3.png";
import styles from "./Header.module.scss";

// маленький helper чтобы не плодить шаблонные строки
const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;

const Header = () => (
    <header className={styles.header}>
        <div className={styles.inner}>
            <div className={styles.logoContainer}>
                <img src={logo} alt="ZHELAZO" className={styles.logoImage} />
            </div>

            <nav className={styles.nav}>
                <NavLink to="/dashboard" className={linkClass}>Главная</NavLink>
                <NavLink to="/stats"     className={linkClass}>Статистика</NavLink>
                <NavLink to="/motivation" className={linkClass}>Мотивация</NavLink>
                <NavLink to="/profile"   className={linkClass}>Профиль</NavLink>
            </nav>
        </div>
    </header>
);

export default Header;
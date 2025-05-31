import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import styles from "./Header.module.scss";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle   = () => setIsOpen((p) => !p);
    const closeNav = () => setIsOpen(false);

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `${styles.navLink} ${isActive ? styles.active : ""}`;

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link to="/dashboard" className={styles.logoLink} onClick={closeNav}>
                    <img src={logo} alt="ZHELAZO" className={styles.logoImage} />
                </Link>

                {/* бургер — виден только на мобилке */}
                <button
                    className={`${styles.burger} ${isOpen ? styles.open : ""}`}
                    aria-label="Открыть меню"
                    onClick={toggle}
                >
                    <span /><span /><span />
                </button>

                {/* навигация */}
                <nav
                    className={`${styles.nav} ${isOpen ? styles.show : ""}`}
                    onClick={closeNav}          /* клик по ссылке закрывает меню */
                >
                    <NavLink to="/dashboard"  className={linkClass}>Главная</NavLink>
                    <NavLink to="/stats"      className={linkClass}>Статистика</NavLink>
                    <NavLink to="/motivation" className={linkClass}>Мотивация</NavLink>
                    <NavLink to="/profile"    className={linkClass}>Профиль</NavLink>
                </nav>
            </div>
        </header>
    );
};

export default Header;
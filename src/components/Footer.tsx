import styles from "./Footer.module.scss";

const Footer = () => (
    <footer className={styles.footer}>
        <div className={styles.inner}>
            <span className={styles.brand}>© 2025 ZHELAZO ·</span>
            <a
                href="https://github.com/Zhaglo/zhelazo-app"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
            >
                GitHub
            </a>
        </div>
    </footer>
);

export default Footer;
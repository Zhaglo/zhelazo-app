import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.scss";

const NotFoundPage = () => (
    <div className={styles.wrapper}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.text}>Упс, страница не найдена :(</p>

        <Link to="/dashboard" className={styles.homeButton}>
            На главную
        </Link>
    </div>
);

export default NotFoundPage;
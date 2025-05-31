// src/layouts/PrivateLayout.tsx
import { Outlet, Navigate } from "react-router-dom";
import Header  from "../components/Header/Header";
import Footer  from "../components/Footer/Footer";
import styles  from "./PrivateLayout.module.scss";   // ★ добавили css-модуль

const isAuthenticated = () => Boolean(localStorage.getItem("token"));

const PrivateLayout = () => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className={styles.layout}>
            <Header />

            <main className={styles.content}>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default PrivateLayout;
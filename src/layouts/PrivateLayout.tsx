import Header from "../components/Header";
import { Outlet, Navigate } from "react-router-dom";
import styles from "../pages/DashboardPage.module.scss";

const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

const PrivateLayout = () => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            <Header />
            <main style={{ padding: "1rem auto" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default PrivateLayout;
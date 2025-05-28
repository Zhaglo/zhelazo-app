import Header from "../components/Header";
import { Outlet, Navigate } from "react-router-dom";

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
            <main style={{ padding: "1rem" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default PrivateLayout;
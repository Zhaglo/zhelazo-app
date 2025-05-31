import Header from "../components/Header";
import Footer from "../components/Footer";
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
            <main style={{ padding: "1rem auto" }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PrivateLayout;
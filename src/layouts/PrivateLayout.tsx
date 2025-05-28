import { Navigate, Outlet } from "react-router-dom";

// Заглушка проверки авторизации — позже заменим на реальную проверку
const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

const PrivateLayout = () => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            {/* Можно добавить общий Header/NavBar тут */}
            <Outlet />
        </div>
    );
};

export default PrivateLayout;
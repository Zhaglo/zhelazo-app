import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import StatsPage from "./pages/StatsPage";
import MotivationPage from "./pages/MotivationPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivateLayout from "./layouts/PrivateLayout";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<PrivateLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/motivation" element={<MotivationPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default App;
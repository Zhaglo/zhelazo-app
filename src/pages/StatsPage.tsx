import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface Habit {
    id: string;
    title: string;
    color: string;
    createdAt: string;
    days: Record<string, boolean>;
    userId: string;
}

const StatsPage = () => {
    const userId = localStorage.getItem("token");
    const [habits, setHabits] = useState<Habit[]>([]);

    useEffect(() => {
        const allHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const userHabits = allHabits.filter((h: Habit) => h.userId === userId);
        setHabits(userHabits);
    }, [userId]);

    const totalHabits = habits.length;

    const totalCompletions = habits.reduce((acc, habit) => {
        return acc + Object.values(habit.days || {}).filter(Boolean).length;
    }, 0);

    const maxStreak = (habit: Habit): number => {
        const dates = Object.entries(habit.days || {})
            .filter(([_, done]) => done)
            .map(([date]) => date)
            .sort();

        let streak = 0;
        let max = 0;
        let lastDate: Date | null = null;

        for (const dateStr of dates) {
            const [day, month, year] = dateStr.split(".").map(Number);
            const date = new Date(year, month - 1, day);

            if (lastDate) {
                const diff = (date.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
                if (diff === 1) {
                    streak++;
                } else {
                    streak = 1;
                }
            } else {
                streak = 1;
            }

            max = Math.max(max, streak);
            lastDate = date;
        }

        return max;
    };

    const bestStreak = Math.max(...habits.map(maxStreak), 0);

    const data = {
        labels: habits.map((h) => h.title),
        datasets: [
            {
                label: "Количество выполнений",
                data: habits.map((h) => Object.values(h.days || {}).filter(Boolean).length),
                backgroundColor: habits.map((h) => h.color),
            },
        ],
    };

    return (
        <div>
            <h2>Статистика</h2>
            <p>Всего привычек: {totalHabits}</p>
            <p>Всего выполнений: {totalCompletions}</p>
            <p>Максимальный стрик: {bestStreak} дней подряд</p>

            {habits.length > 0 && (
                <div style={{ maxWidth: "600px", marginTop: "2rem" }}>
                    <Bar data={data} />
                </div>
            )}
        </div>
    );
};

export default StatsPage;
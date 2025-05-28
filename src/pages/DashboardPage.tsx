import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";

interface Habit {
    id: string;
    title: string;
    color: string;
    createdAt: string;
    days: Record<string, boolean>;
    userId: string;
}

const formatDate = (date: Date) =>
    date.toLocaleDateString("ru-RU").split(".").join(".");

const DashboardPage = () => {
    const userId = localStorage.getItem("token");
    const [habits, setHabits] = useState<Habit[]>([]);
    const today = formatDate(new Date());

    useEffect(() => {
        const allHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const userHabits = allHabits.filter((h: Habit) => h.userId === userId);
        setHabits(userHabits);
    }, [userId]);

    const saveHabits = (updatedHabits: Habit[]) => {
        localStorage.setItem("habits", JSON.stringify(updatedHabits));
        setHabits(updatedHabits.filter((h) => h.userId === userId));
    };

    const handleAddHabit = (title: string, color: string) => {
        const newHabit: Habit = {
            id: uuidv4(),
            title,
            color,
            createdAt: new Date().toISOString(),
            days: {},
            userId: userId!,
        };

        const allHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const updatedHabits = [...allHabits, newHabit];
        saveHabits(updatedHabits);
    };

    const toggleDay = (habitId: string) => {
        const allHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const updated = allHabits.map((habit: Habit) => {
            if (habit.id === habitId) {
                const current = habit.days?.[today] || false;
                return {
                    ...habit,
                    days: {
                        ...habit.days,
                        [today]: !current,
                    },
                };
            }
            return habit;
        });

        saveHabits(updated);
    };

    const handleDeleteHabit = (habitId: string) => {
        const allHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const updatedHabits = allHabits.filter((h: Habit) => h.id !== habitId);
        saveHabits(updatedHabits);
    };

    return (
        <div>
            <h2>Ваши привычки на {today}</h2>

            <HabitForm onAddHabit={handleAddHabit} />

            <ul>
                {habits.map((habit) => (
                    <HabitCard
                        key={habit.id}
                        id={habit.id}
                        title={habit.title}
                        color={habit.color}
                        completed={habit.days?.[today] || false}
                        onToggle={toggleDay}
                        onDelete={handleDeleteHabit}
                    />
                ))}
            </ul>
        </div>
    );
};

export default DashboardPage;
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Habit {
    id: string;
    title: string;
    color: string;
    createdAt: string;
    days: Record<string, boolean>;
    userId: string;
}

const DashboardPage = () => {
    const userId = localStorage.getItem("token");
    const [habits, setHabits] = useState<Habit[]>([]);
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#00bfff");

    const formatDate = (date: Date) =>
        date.toLocaleDateString("ru-RU").split(".").join(".");

    const today = formatDate(new Date()); // "28.05.2025"

    useEffect(() => {
        const allHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const userHabits = allHabits.filter((h: Habit) => h.userId === userId);
        setHabits(userHabits);
    }, [userId]);

    const saveHabits = (updatedHabits: Habit[]) => {
        localStorage.setItem("habits", JSON.stringify(updatedHabits));
        setHabits(updatedHabits.filter((h) => h.userId === userId));
    };

    const handleAddHabit = (e: React.FormEvent) => {
        e.preventDefault();

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
        setTitle("");
        setColor("#00bfff");
    };

    const handleDeleteHabit = (habitId: string) => {
        const allHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const updatedHabits = allHabits.filter((h: Habit) => h.id !== habitId);
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

    return (
        <div>
            <h2>Ваши привычки на {today}</h2>

            <form onSubmit={handleAddHabit}>
                <input
                    type="text"
                    placeholder="Название привычки"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                <button type="submit">Добавить</button>
            </form>

            <ul>
                {habits.map((habit) => (
                    <li
                        key={habit.id}
                        style={{
                            borderLeft: `8px solid ${habit.color}`,
                            padding: "8px",
                            marginBottom: "8px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <label>
                            <input
                                type="checkbox"
                                checked={habit.days?.[today] || false}
                                onChange={() => toggleDay(habit.id)}
                            />{" "}
                            {habit.title}
                        </label>
                        <button onClick={() => handleDeleteHabit(habit.id)}>❌</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DashboardPage;
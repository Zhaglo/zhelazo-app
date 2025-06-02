import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import HabitCard from "../../components/HabitCard/HabitCard";
import HabitModal from "../../components/HabitModal/HabitModal";
import styles from "./DashboardPage.module.scss";
import useSmartFabPosition from "../../hooks/useSmartFabPosition";
import { Habit, Frequency } from "../../types/habit";

const formatDate = (date: Date) =>
    date.toLocaleDateString("ru-RU").split(".").join(".");

const getWeekKey = (date = new Date()) => {
    const year = date.getFullYear();
    const week = Math.ceil(
        ((+date - +new Date(year, 0, 1)) / 86400000 + new Date(year, 0, 1).getDay()) / 7
    );
    return `${year}_W${week}`;
};

const DashboardPage = () => {
    const userId = localStorage.getItem("token");
    const [habits, setHabits] = useState<Habit[]>([]);
    const [showModal, setShowModal] = useState(false);
    const liftFab = useSmartFabPosition();

    const now = new Date();
    const today = formatDate(now);
    const weekKey = getWeekKey(now);

    useEffect(() => {
        const allHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const userHabits = allHabits.filter((h: Habit) => h.userId === userId);
        setHabits(userHabits);
    }, [userId]);

    const saveHabits = (updatedHabits: Habit[]) => {
        localStorage.setItem("habits", JSON.stringify(updatedHabits));
        setHabits(updatedHabits.filter((h) => h.userId === userId));
    };

    const handleAddHabit = (
        title: string,
        color: string,
        frequency: Frequency,
        description?: string,
        timeRange?: { from: string; to: string }
    ) => {
        const newHabit: Habit = {
            id: uuidv4(),
            title,
            color,
            createdAt: today,
            days: {},
            userId: userId!,
            frequency,
            description,
            timeRange,
        };

        const allHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const updatedHabits = [...allHabits, newHabit];
        saveHabits(updatedHabits);
    };

    const toggleDay = (habitId: string, key: string, extraKey?: string) => {
        const allHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const updated = allHabits.map((habit: Habit) => {
            if (habit.id === habitId) {
                const newDays = { ...habit.days };
                const current = newDays[key];
                newDays[key] = !current;

                // если передан extraKey → это todayKey для WeeklyCard
                if (extraKey) {
                    if (!current) {
                        newDays[extraKey] = true;
                    } else {
                        delete newDays[extraKey];
                    }
                }

                return {
                    ...habit,
                    days: newDays,
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

    const dailyHabits = habits.filter((h) => h.frequency === "daily");
    const hourlyHabits = habits.filter((h) => h.frequency === "hourly");
    const weeklyHabits = habits.filter((h) => h.frequency === "weekly");

    return (
        <div className={styles.wrapper}>
            {showModal && (
                <HabitModal
                    onClose={() => setShowModal(false)}
                    onAddHabit={(title, color, frequency, description, timeRange) => {
                        handleAddHabit(title, color, frequency, description, timeRange);
                        setShowModal(false);
                    }}
                />
            )}

            {habits.length === 0 ? (
                <p className={styles.empty}>У вас пока нет привычек.</p>
            ) : (
                <>
                    {dailyHabits.length > 0 && (
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>Ежедневные привычки</h3>
                            <div className={`${styles.grid} ${dailyHabits.length >= 4 ? styles.balanced : ""}`}>
                                {dailyHabits.map((habit) => (
                                    <HabitCard
                                        key={habit.id}
                                        habit={habit}
                                        onToggle={toggleDay}
                                        onDelete={handleDeleteHabit}
                                        today={today}
                                        weekKey={weekKey}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {hourlyHabits.length > 0 && (
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>Ежечасные привычки</h3>
                            <div className={`${styles.grid} ${hourlyHabits.length >= 4 ? styles.balanced : ""}`}>
                                {hourlyHabits.map((habit) => (
                                    <HabitCard
                                        key={habit.id}
                                        habit={habit}
                                        onToggle={toggleDay}
                                        onDelete={handleDeleteHabit}
                                        today={today}
                                        weekKey={weekKey}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {weeklyHabits.length > 0 && (
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>Еженедельные привычки</h3>
                            <div className={`${styles.grid} ${weeklyHabits.length >= 4 ? styles.balanced : ""}`}>
                                {weeklyHabits.map((habit) => (
                                    <HabitCard
                                        key={habit.id}
                                        habit={habit}
                                        onToggle={toggleDay}
                                        onDelete={handleDeleteHabit}
                                        today={today}
                                        weekKey={weekKey}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}

            <button
                className={`${styles.floatingButton} ${liftFab ? styles.lift : ""}`}
                onClick={() => setShowModal(true)}
            >
                <span className={styles.plus}>+</span>
                Добавить привычку
            </button>
        </div>
    );
};

export default DashboardPage;
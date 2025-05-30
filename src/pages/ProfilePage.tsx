import styles from "./ProfilePage.module.scss";
import { useEffect, useState } from "react";
import { Habit } from "../types/habit";

interface UserProfile {
    avatar: string;
    name: string;
    tag: string;
    email: string;
    registered: string;
}

const ProfilePage = () => {
    const userId = localStorage.getItem("token");

    // Привычки юзера
    const allHabits: Habit[] = JSON.parse(localStorage.getItem("habits") || "[]");
    const userHabits = allHabits.filter(h => h.userId === userId);

    // Профиль юзера
    const rawProfile = JSON.parse(localStorage.getItem(`userProfile_${userId}`) || "{}");

    const userProfile: UserProfile = {
        avatar: rawProfile.avatar || "😈",
        name: rawProfile.name || "Игорь",
        tag: rawProfile.tag || "@frontend_god_69",
        email: rawProfile.email || "igor@mail.com",
        registered: rawProfile.registered || "март 2025",
    };

    // Стейт
    const [habitsCount, setHabitsCount] = useState(0);
    const [totalStreak, setTotalStreak] = useState(0);
    const [bestHabit, setBestHabit] = useState("—");

    // Подсчет стрика одной привычки
    const calcHabitStreak = (habit: Habit): number => {
        const days = habit.days || {};
        const dates = Object.entries(days)
            .filter(([key, done]) => done && !key.includes("_") && !key.includes("W"))
            .map(([date]) => date)
            .sort();

        let streak = 0;
        let max = 0;
        let lastDate: Date | null = null;

        for (const dateStr of dates) {
            const [d, m, y] = dateStr.split(".").map(Number);
            const date = new Date(y, m - 1, d);

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

    // useEffect
    useEffect(() => {
        setHabitsCount(userHabits.length);

        const streakSum = userHabits.reduce((acc: number, habit: Habit) => {
            return acc + calcHabitStreak(habit);
        }, 0);
        setTotalStreak(streakSum);

        const best = userHabits
            .map(habit => ({
                title: habit.title,
                streak: calcHabitStreak(habit)
            }))
            .sort((a, b) => b.streak - a.streak)[0]?.title || "—";

        setBestHabit(best);
    }, [userHabits]);

    // Ачивки
    const getAchievements = (): { icon: string; label: string }[] => {
        const achs = [];

        if (habitsCount >= 7) {
            achs.push({ icon: "🎯", label: "7 привычек мастера" });
        }

        const maxHabitStreak = Math.max(...userHabits.map(habit => calcHabitStreak(habit)), 0);

        if (maxHabitStreak >= 100) {
            achs.push({ icon: "🏅", label: "100 дней без пропусков" });
        } else if (maxHabitStreak >= 50) {
            achs.push({ icon: "⭐", label: "50 дней стабильности" });
        }

        // Прогресс
        const progressKey = `userProgress_${userId}`;
        const currentProgress = JSON.parse(localStorage.getItem(progressKey) || "{}");
        const motivationVisits = currentProgress.motivationVisits || 0;

        if (motivationVisits >= 5) {
            achs.push({ icon: "🧘", label: "Залетал на мотивацию 5 раз" });
        } else if (motivationVisits > 0) {
            achs.push({ icon: "🧘", label: `Посещал мотивацию (${motivationVisits} раз)` });
        }

        if (maxHabitStreak >= 60) {
            achs.push({ icon: "🏆", label: "Вошел в ТОП" });
        }

        return achs;
    };

    // JSX
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.pageTitle}>👤 Профиль пользователя</h2>

            <div className={styles.profileBlock}>
                {/* Инфа */}
                <div className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <span className={styles.profileAvatar}>{userProfile.avatar}</span>
                        <div>
                            <div className={styles.profileName}>{userProfile.name}</div>
                            <div className={styles.profileTag}>{userProfile.tag}</div>
                            <div className={styles.profileEmail}>📧 {userProfile.email}</div>
                            <div className={styles.profileRegistered}>🗓 С нами с: {userProfile.registered}</div>
                        </div>
                    </div>
                </div>

                {/* Статы */}
                <div className={styles.profileCard}>
                    <h3>📊 Ваша статистика</h3>
                    <ul className={styles.profileStats}>
                        <li>✅ Привычек: {habitsCount}</li>
                        <li>🔥 Общий стрик: {totalStreak} дней</li>
                        <li>🏅 Лучшая привычка: {bestHabit}</li>
                        <li>🕒 Последний вход: Сегодня</li>
                    </ul>
                </div>

                {/* Ачивки */}
                <div className={styles.profileCard}>
                    <h3>🎖️ Ваши достижения</h3>
                    <ul className={styles.profileAchievements}>
                        {getAchievements().map((ach, index) => (
                            <li key={index}>
                                <span className={styles.achIcon}>{ach.icon}</span> {ach.label}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Кнопка */}
                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <button className={styles.editButton}>✏️ Редактировать профиль</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
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

    const allHabits: Habit[] = JSON.parse(localStorage.getItem("habits") || "[]");
    const userHabits = allHabits.filter(h => h.userId === userId);

    const rawProfile = JSON.parse(localStorage.getItem(`userProfile_${userId}`) || "{}");

    const initialProfile: UserProfile = {
        avatar: rawProfile.avatar || "😈",
        name: rawProfile.name || "Игорь",
        tag: rawProfile.tag || "@frontend_god_69",
        email: rawProfile.email || "igor@mail.com",
        registered: rawProfile.registered || "март 2025",
    };

    const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);

    // Модалка
    const [showModal, setShowModal] = useState(false);
    const [editProfile, setEditProfile] = useState<UserProfile>(initialProfile);

    const [habitsCount, setHabitsCount] = useState(0);
    const [totalStreak, setTotalStreak] = useState(0);
    const [bestHabit, setBestHabit] = useState("—");

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

    // Сохранение
    const handleSaveProfile = () => {
        setUserProfile(editProfile);
        localStorage.setItem(`userProfile_${userId}`, JSON.stringify(editProfile));
        setShowModal(false);
    };

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
                <div className={styles.editButtonWrapper}>
                    <button
                        className={styles.editButton}
                        onClick={() => {
                            setEditProfile(userProfile);
                            setShowModal(true);
                        }}
                    >
                        ✏️ Редактировать профиль
                    </button>
                </div>

            </div>

            {/* Модалка */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>✏️ Редактировать профиль</h3>

                        <label>
                            Аватар (эмодзи):
                            <input
                                type="text"
                                maxLength={2}
                                value={editProfile.avatar}
                                onChange={(e) => setEditProfile({ ...editProfile, avatar: e.target.value })}
                            />
                        </label>

                        <label>
                            Имя:
                            <input
                                type="text"
                                value={editProfile.name}
                                onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                            />
                        </label>

                        <label>
                            Тег:
                            <input
                                type="text"
                                value={editProfile.tag}
                                onChange={(e) => setEditProfile({ ...editProfile, tag: e.target.value })}
                            />
                        </label>

                        <label>
                            Email:
                            <input
                                type="email"
                                value={editProfile.email}
                                onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                            />
                        </label>

                        <div style={{ marginTop: "1rem", textAlign: "center" }}>
                            <button className={styles.editButton} onClick={handleSaveProfile}>
                                ✅ Сохранить
                            </button>
                            <button
                                className={styles.editButton}
                                style={{ marginLeft: "1rem", backgroundColor: "#ddd", color: "#333" }}
                                onClick={() => setShowModal(false)}
                            >
                                ❌ Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
import styles from "./ProfilePage.module.scss";

const user = {
    avatar: "😈",
    name: "Игорь",
    tag: "@frontend_god_69",
    email: "igor@mail.com",
    registered: "март 2025",
};

const stats = {
    habitsCount: 7,
    totalStreak: 231,
    bestHabit: "Писать курсовую по Фронтенду",
    lastLogin: "Сегодня",
};

const achievements = [
    { icon: "🏅", label: "100 дней без пропусков" },
    { icon: "🏆", label: "Вошел в ТОП" },
    { icon: "🔥", label: "Легендарный фронтендер" },
    { icon: "🧘", label: "Залетал на мотивацию 5 раз" },
];

const ProfilePage = () => {
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.pageTitle}>👤 Профиль пользователя</h2>

            <div className={styles.profileBlock}>

                {/* Инфа */}
                <div className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <span className={styles.profileAvatar}>{user.avatar}</span>
                        <div>
                            <div className={styles.profileName}>{user.name}</div>
                            <div className={styles.profileTag}>{user.tag}</div>
                            <div className={styles.profileEmail}>📧 {user.email}</div>
                            <div className={styles.profileRegistered}>🗓 С нами с: {user.registered}</div>
                        </div>
                    </div>
                </div>

                {/* Статы */}
                <div className={styles.profileCard}>
                    <h3>📊 Ваша статистика</h3>
                    <ul className={styles.profileStats}>
                        <li>✅ Привычек: {stats.habitsCount}</li>
                        <li>🔥 Общий стрик: {stats.totalStreak} дней</li>
                        <li>🏅 Лучшая привычка: {stats.bestHabit}</li>
                        <li>🕒 Последний вход: {stats.lastLogin}</li>
                    </ul>
                </div>

                {/* Ачивки */}
                <div className={styles.profileCard}>
                    <h3>🎖️ Ваши достижения</h3>
                    <ul className={styles.profileAchievements}>
                        {achievements.map((ach, index) => (
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
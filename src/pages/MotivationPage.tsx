import styles from "./MotivationPage.module.scss";
import { useState, useEffect } from "react";
import { users, quotes, stathamQuotes } from "../data/motivationData";

const MotivationPage = () => {
    const sortedUsers = [...users].sort((a, b) => b.streak - a.streak);

    const TOP_LIMIT = 20; // например, показываем только 12 пользователей

    const topUsers = sortedUsers.slice(0, TOP_LIMIT);

    const getMedal = (index: number, streak: number): string => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        if (streak >= 100) return "🏆";
        if (streak >= 50) return "⭐️";
        if (streak >= 30) return "🎖️";
        return "💪";
    };

    const [quoteOfDay, setQuoteOfDay] = useState("");
    const [stathamQuote, setStathamQuote] = useState("");

    useEffect(() => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const randomStatham = stathamQuotes[Math.floor(Math.random() * stathamQuotes.length)];

        setQuoteOfDay(randomQuote);
        setStathamQuote(randomStatham);
    }, []);

    return (
        <div className={styles.pageContainer}>

            <div className={styles.motivationBlock}>
                <h2>📌 Полезная информация</h2>

                <div className={styles.quoteGrid}>
                    <div className={styles.quoteBlock}>
                        <h3>📝 Цитата дня</h3>
                        <blockquote>"{quoteOfDay}"</blockquote>
                    </div>

                    <div className={styles.stathamBlock}>
                        <h3>🐺 Цитата Джейсона Стетхэма</h3>
                        <blockquote>"{stathamQuote}"</blockquote>
                    </div>
                </div>
            </div>

            <div className={styles.topSection}>
                <h3 className={styles.sectionTitle}>🏆 ТОП-20 пользователей по стрикам</h3>

                <div className={styles.topGrid}>
                    {topUsers.map((user, index) => (
                        <div key={user.tag} className={styles.topCard}>
                            <div className={styles.topHeader}>
                                <span className={styles.avatar}>{user.emoji}</span>
                                <div>
                                    <strong>{user.name}</strong>
                                    <div className={styles.userTag}>{user.tag}</div>
                                </div>
                                <div className={styles.medal}>{getMedal(index, user.streak)}</div>
                            </div>

                            <div className={styles.topHabit}>
                                <em>"{user.habit}"</em>
                            </div>

                            <div className={styles.streak}>
                                🔥 {user.streak} дней подряд
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.footerNote}>
                🚀 Ты тоже можешь попасть в ТОП — прокачивай свои привычки каждый день!
            </div>
        </div>
    );
};

export default MotivationPage;
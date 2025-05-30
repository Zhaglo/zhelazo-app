import styles from "./MotivationCard.module.scss";
import { MotivationCardProps } from "../types/props"

const MotivationCard = ({ user, username, avatar = "🙂", habit, streak, target = 100 }: MotivationCardProps) => {
    const progressPercent = Math.min((streak / target) * 100, 100);

    const getBadge = () => {
        if (streak >= 100) return "🏅";
        if (streak >= 50) return "⭐️";
        if (streak >= 30) return "🔥";
        if (streak >= 7) return "💪";
        return "✨";
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.avatar}>{avatar}</div>
                <div>
                    <div className={styles.userName}>{user}</div>
                    <div className={styles.username}>@{username}</div>
                </div>
            </div>

            <div className={styles.habit}>
                <em>"{habit}"</em>
            </div>

            <div className={styles.progressBar}>
                <div
                    className={styles.progress}
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>

            <div className={styles.streak}>
                {getBadge()} Стрик: {streak} дней подряд
            </div>
        </div>
    );
};

export default MotivationCard;
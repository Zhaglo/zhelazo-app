import styles from "./HabitCard.module.scss";
import { WeeklyCardProps } from "../../types/props";

const WeeklyCard = ({ habit, onToggle, onDelete, weekKey }: WeeklyCardProps) => {
    const isChecked = habit.days?.[weekKey] || false;
    const totalDone = Object.values(habit.days || {}).filter(Boolean).length;

    return (
        <div className={styles.card}>
            <div className={styles.colorStripe} style={{ backgroundColor: habit.color }} />
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{habit.title}</h3>
                    <button className={styles.delete} onClick={() => onDelete(habit.id)}>🗑</button>
                </div>

                <div className={styles.meta}>
                    <span>Создано: {habit.createdAt}</span>
                    <span>Недель подряд: {totalDone}</span>
                </div>

                <div className={styles.frequency}>Еженедельно</div>

                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggle(habit.id, weekKey)}
                    />
                    <span>Отметить неделю</span>
                </label>
            </div>
        </div>
    );
};

export default WeeklyCard;
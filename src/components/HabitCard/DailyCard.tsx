import styles from "./HabitCard.module.scss";
import { DailyCardProps } from "../../types/props";

const DailyCard = ({ habit, onToggle, onDelete, today }: DailyCardProps) => {
    const isChecked = habit.days?.[today] || false;
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
                    <span>Дней подряд: {totalDone}</span>
                </div>
                <label className={styles.checkbox}>
                    <input type="checkbox" checked={isChecked} onChange={() => onToggle(habit.id, today)} />
                    <span>Отметить на сегодня</span>
                </label>
            </div>
        </div>
    );
};

export default DailyCard;
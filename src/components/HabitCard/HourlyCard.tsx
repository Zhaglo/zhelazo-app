import { useState } from "react";
import styles from "./HabitCard.module.scss";
import { HourlyCardProps } from "../../types/props";

const generateHours = (from: string, to: string): string[] => {
    const result: string[] = [];
    const start = parseInt(from.split(":")[0]);
    const end = parseInt(to.split(":")[0]);
    for (let h = start; h <= end; h++) {
        result.push(h.toString().padStart(2, "0") + ":00");
    }
    return result;
};

const HourlyCard = ({ habit, onToggle, onDelete, today }: HourlyCardProps) => {
    const [hoveringCenter, setHoveringCenter] = useState(false);

    const hours = habit.timeRange ? generateHours(habit.timeRange.from, habit.timeRange.to) : [];
    const doneHours = hours.filter((hour) => habit.days?.[`${today}_${hour}`]);
    const pct = Math.round((doneHours.length / hours.length) * 100);

    const toggleHour = (hour: string) => {
        const key = `${today}_${hour}`;
        onToggle(habit.id, key);
    };

    const toggleAll = () => {
        const markAll = doneHours.length !== hours.length;
        hours.forEach((hour) => {
            const key = `${today}_${hour}`;
            const current = !!habit.days?.[key];
            if (current !== markAll) {
                onToggle(habit.id, key);
            }
        });
    };

    const angleStep = 360 / hours.length;

    return (
        <div
            className={`${styles.card} ${doneHours.length === hours.length ? styles.completed : ""}`}
            style={{ ["--color" as any]: habit.color }}
        >
            <div className={styles.colorStripe} />
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{habit.title}</h3>
                    <button className={styles.delete} onClick={() => onDelete(habit.id)}>🗑</button>
                </div>

                <div className={styles.meta}>
                    <span>Создано: {habit.createdAt}</span>
                    <span>Выполнено: {doneHours.length}/{hours.length}</span>
                </div>

                <div className={styles.hourCircle}>
                    {hours.map((hour, i) => {
                        const key = `${today}_${hour}`;
                        const isChecked = habit.days?.[key] || false;

                        const angle = angleStep * i - 90;
                        const x = 110 + 90 * Math.cos((angle * Math.PI) / 180);
                        const y = 110 + 90 * Math.sin((angle * Math.PI) / 180);

                        return (
                            <button
                                key={hour}
                                title={hour}
                                className={`${styles.hourDot} ${isChecked ? styles.done : ""}`}
                                onClick={() => toggleHour(hour)}
                                style={{ left: `${x}px`, top: `${y}px` }}
                            >
                                {hour.slice(0, 2)}
                            </button>
                        );
                    })}

                    <div
                        className={styles.hourCenter}
                        onMouseEnter={() => setHoveringCenter(true)}
                        onMouseLeave={() => setHoveringCenter(false)}
                        onClick={toggleAll}
                        title={
                            pct === 100
                                ? "Сбросить все часы"
                                : "Отметить все часы"
                        }
                    >
                        {hoveringCenter ? (pct === 100 ? "✕" : "✓") : `${pct}%`}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HourlyCard;
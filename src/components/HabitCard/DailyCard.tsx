import { useState } from "react";
import styles from "./HabitCard.module.scss";
import { DailyCardProps } from "../../types/props";

const DailyCard = ({ habit, onToggle, onDelete, today }: DailyCardProps) => {
    const [showDescription, setShowDescription] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [desc, setDesc] = useState(habit.description || "");

    const doneToday = !!habit.days?.[today];
    const streak = calculateDailyStreak(habit, today);

    const handleToggle = () => onToggle(habit.id, today);

    const saveDescription = () => {
        const allHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const updatedHabits = allHabits.map((h: any) =>
            h.id === habit.id ? { ...h, description: desc } : h
        );
        localStorage.setItem("habits", JSON.stringify(updatedHabits));
        habit.description = desc; // обновим локально
        setIsEditing(false);
    };

    return (
        <div
            className={`${styles.card} ${doneToday ? styles.completed : ""}`}
            style={{ ["--color" as any]: habit.color }}
        >
            <div className={styles.colorStripe} />

            <div className={styles.weekProgressWrapper}>
                <div className={styles.weekProgress}>
                    {getLast7Days(today).map((day) => (
                        <span
                            key={day}
                            className={`${styles.weekDot} ${
                                habit.days?.[day] ? styles.filled : ""
                            }`}
                            title={day}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{habit.title}</h3>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className={styles.edit} onClick={() => setIsEditing(p => !p)} title="Редактировать">✏️</button>
                        <button className={styles.delete} onClick={() => onDelete(habit.id)} title="Удалить">🗑</button>
                    </div>
                </div>

                <div className={styles.meta}>
                    <span>Дней подряд: {streak}</span>
                </div>

                <button
                    className={`${styles.checkBtn} ${doneToday ? styles.done : ""}`}
                    onClick={handleToggle}
                >
                    {doneToday && "✓"}
                </button>

                {isEditing && (
                    <div className={styles.descriptionEditor}>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows={3}
                            placeholder="Описание привычки"
                        />
                        <button onClick={saveDescription} className="btn btn-success btn-sm">Сохранить</button>
                    </div>
                )}
            </div>

            {/* Стрелка — всегда отображается */}
            {(habit.description || habit.createdAt || isEditing) && (
                <div
                    className={`${styles.slideTrigger} ${showDescription ? styles.open : ""}`}
                    onClick={() => setShowDescription((p) => !p)}
                >
                    <div className={styles.slideArrow}></div>
                </div>
            )}

            {/* Описание — выезжает по флагу showDescription */}
            {(habit.description || habit.createdAt) && (
                <div className={`${styles.descriptionWrapper} ${showDescription ? styles.open : ""}`}>
                    <div className={styles.slideContent}>
                        {habit.description && <p>{habit.description}</p>}
                        {habit.createdAt && (
                            <p className={styles.createdAt}>Создано: {habit.createdAt}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ───────── helpers ───────── */

function calculateDailyStreak(habit: DailyCardProps["habit"], today: string): number {
    const dateKeys = Object.keys(habit.days || {}).filter((k) => !k.includes("_"));
    if (dateKeys.length === 0) return 0;

    const sorted = dateKeys.sort((a, b) => toDate(a).getTime() - toDate(b).getTime());

    let currentStreak = 0;
    let maxStreak = 0;
    let prev: Date | null = null;

    for (const dateStr of sorted) {
        if (!habit.days[dateStr]) {
            currentStreak = 0;
            prev = null;
            continue;
        }

        const d = toDate(dateStr);

        if (prev && (d.getTime() - prev.getTime()) / 86400000 === 1) {
            currentStreak += 1;
        } else {
            currentStreak = 1;
        }

        prev = d;
        maxStreak = Math.max(maxStreak, currentStreak);
    }

    return doneToday(habit, today) ? currentStreak : maxStreak;
}

function getLast7Days(today: string): string[] {
    const result: string[] = [];
    const [d, m, y] = today.split(".").map(Number);
    const base = new Date(y, m - 1, d);
    for (let i = 6; i >= 0; i--) {
        const date = new Date(base);
        date.setDate(base.getDate() - i);
        result.push(date.toLocaleDateString("ru-RU").split(".").join("."));
    }
    return result;
}

const toDate = (s: string) => {
    const [d, m, y] = s.split(".").map(Number);
    return new Date(y, m - 1, d);
};

const doneToday = (h: DailyCardProps["habit"], today: string) => !!h.days?.[today];

export default DailyCard;
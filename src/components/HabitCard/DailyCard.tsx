import { useState } from "react";
import base from "./HabitCard.module.scss";     // общие стили
import styles from "./DailyCard.module.scss";   // стили только для дневных
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
        habit.description = desc;
        setIsEditing(false);
    };

    return (
        <div
            className={`${base.card} ${doneToday ? base.completed : ""}`}
            style={{ ["--color" as any]: habit.color }}
        >
            <div className={base.colorStripe} />

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

            <div className={base.content}>
                <div className={base.header}>
                    <h3 className={base.title}>{habit.title}</h3>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className={base.edit} onClick={() => setIsEditing(p => !p)} title="Редактировать">✏️</button>
                        <button className={base.delete} onClick={() => onDelete(habit.id)} title="Удалить">🗑</button>
                    </div>
                </div>

                <div className={base.bottomInfo}>
                    <span>Дней подряд: {streak}</span>
                </div>

                <button
                    className={`${base.checkBtn} ${doneToday ? base.done : ""}`}
                    onClick={handleToggle}
                >
                    {doneToday && "✓"}
                </button>

                {isEditing ? (
                    <div className={base.descriptionEditor}>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows={3}
                            className={base.descriptionInput}
                            placeholder="Введите описание привычки..."
                        />
                        <div className={base.editorButtons}>
                            <button onClick={saveDescription} className={base.saveBtn}>Сохранить</button>
                            <button onClick={() => setIsEditing(false)} className={base.cancelBtn}>Отмена</button>
                        </div>
                    </div>
                ) : null}
            </div>

            {(habit.description || habit.createdAt || isEditing) && (
                <div
                    className={`${base.slideTrigger} ${showDescription ? base.open : ""}`}
                    onClick={() => setShowDescription((p) => !p)}
                >
                    <div className={base.slideArrow}></div>
                </div>
            )}

            {(habit.description || habit.createdAt) && (
                <div className={`${base.descriptionWrapper} ${showDescription ? base.open : ""}`}>
                    <div className={base.slideContent}>
                        {habit.description && <p>{habit.description}</p>}
                        {habit.createdAt && (
                            <p className={base.createdAt}>Создано: {habit.createdAt}</p>
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
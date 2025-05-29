import { useState } from "react";
import styles from "./HabitCard.module.scss";
import { WeeklyCardProps } from "../../types/props";

const WeeklyCard = ({ habit, onToggle, onDelete, weekKey }: WeeklyCardProps) => {
    const isChecked = habit.days?.[weekKey] || false;
    const [isEditing, setIsEditing] = useState(false);
    const [desc, setDesc] = useState(habit.description || "");
    const [showDescription, setShowDescription] = useState(false);

    const totalDone = Object.entries(habit.days || {}).filter(
        ([key, val]) => val && key.includes("W")
    ).length;

    const toggleEdit = () => setIsEditing(!isEditing);

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
            className={`${styles.card} ${isChecked ? styles.completed : ""} ${showDescription ? styles.expanded : ""}`}
            style={{ ["--color" as any]: habit.color }}
        >
            <div className={styles.colorStripe} />

                <div className={styles.streakRow}>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.weekDot} ${i < totalDone ? styles.filled : ""}`}
                        />
                    ))}
                </div>

            <div className={styles.content} style={{ position: "relative" }}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{habit.title}</h3>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className={styles.edit} onClick={toggleEdit} title="Редактировать">✏️</button>
                        <button className={styles.delete} onClick={() => onDelete(habit.id)} title="Удалить">🗑</button>
                    </div>
                </div>

                <div className={styles.bottomInfo}>
                    <span>Недель подряд: {totalDone}</span>
                </div>

                {!isEditing && (
                    <button
                        className={`${styles.checkBtn} ${isChecked ? styles.done : ""}`}
                        onClick={() => onToggle(habit.id, weekKey)}
                    >
                        {isChecked && "✓"}
                    </button>
                )}

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

            {(habit.description || habit.createdAt) && !isEditing && (
                <div className={`${styles.slideWrapper} ${showDescription ? styles.open : ""}`}>
                    <div
                        className={`${styles.slideTrigger} ${showDescription ? styles.open : ""}`}
                        onClick={() => setShowDescription(prev => !prev)}
                    >
                        <div className={styles.slideArrow}></div>
                    </div>
                    <div className={styles.slideContent}>
                        {habit.description && <p>{habit.description}</p>}
                        {habit.createdAt && <p className={styles.createdAt}>Создано: {habit.createdAt}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeeklyCard;
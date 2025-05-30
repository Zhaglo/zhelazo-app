import { useState } from "react";
import base from "./HabitCard.module.scss";
import styles from "./WeeklyCard.module.scss";
import { WeeklyCardProps } from "../../types/props";

const WeeklyCard = ({ habit, onToggle, onDelete, weekKey }: WeeklyCardProps) => {
    const isChecked = habit.days?.[weekKey] || false;
    const [isEditing, setIsEditing] = useState(false);
    const [desc, setDesc] = useState(habit.description || "");
    const [showDescription, setShowDescription] = useState(false);

    const totalDone = Object.entries(habit.days || {}).filter(
        ([key, val]) => val && key.includes("W")
    ).length;

    const toggleWeek = () => {
        const today = new Date();
        const todayKey = today.toLocaleDateString("ru-RU").split(".").join(".");

        // Вместо того чтобы самим ковырять localStorage —
        // просто передаем оба ключа родителю
        onToggle(habit.id, weekKey, todayKey);
    };

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
            className={`${base.card} ${isChecked ? base.completed : ""} ${showDescription ? base.expanded : ""}`}
            style={{ ["--color" as any]: habit.color }}
        >
            <div className={base.colorStripe} />

            <div className={styles.streakRow}>
                {Array.from({ length: 7 }).map((_, i) => (
                    <div
                        key={i}
                        className={`${base.weekDot} ${i < totalDone ? base.filled : ""}`}
                    />
                ))}
            </div>

            <div className={base.content}>
                <div className={base.header}>
                    <h3 className={base.title}>{habit.title}</h3>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className={base.edit} onClick={toggleEdit} title="Редактировать">✏️</button>
                        <button className={base.delete} onClick={() => onDelete(habit.id)} title="Удалить">🗑</button>
                    </div>
                </div>

                <div className={base.bottomInfo}>
                    <span>Недель подряд: {totalDone}</span>
                </div>

                <button
                    className={`${base.checkBtn} ${isChecked ? base.done : ""}`}
                    onClick={toggleWeek}
                >
                    {isChecked && "✓"}
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
                    onClick={() => setShowDescription((prev) => !prev)}
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

export default WeeklyCard;
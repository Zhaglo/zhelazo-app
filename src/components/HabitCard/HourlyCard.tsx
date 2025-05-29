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
    const [showDescription, setShowDescription] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [desc, setDesc] = useState(habit.description || "");

    const hours = habit.timeRange ? generateHours(habit.timeRange.from, habit.timeRange.to) : [];
    const doneHours = hours.filter((hour) => habit.days?.[`${today}_${hour}`]);
    const pct = Math.round((doneHours.length / hours.length) * 100);
    const angleStep = 360 / hours.length;

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

    const toggleEdit = () => setIsEditing((prev) => !prev);

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
            className={`${styles.card} ${doneHours.length === hours.length ? styles.completed : ""}`}
            style={{ ["--color" as any]: habit.color }}
        >
            <div className={styles.colorStripe} />

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{habit.title}</h3>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className={styles.edit} onClick={toggleEdit} title="Редактировать">✏️</button>
                        <button className={styles.delete} onClick={() => onDelete(habit.id)} title="Удалить">🗑</button>
                    </div>
                </div>

                <div className={styles.meta}>
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
                        title={pct === 100 ? "Сбросить все часы" : "Отметить все часы"}
                    >
                        {hoveringCenter ? (pct === 100 ? "✕" : "✓") : `${pct}%`}
                    </div>
                </div>
            </div>

            {/* Стрелка */}
            {(habit.description || habit.createdAt) && !isEditing && (
                <div
                    className={`${styles.slideTrigger} ${showDescription ? styles.open : ""}`}
                    onClick={() => setShowDescription((p) => !p)}
                >
                    <div className={styles.slideArrow}></div>
                </div>
            )}

            {/* Контент описания */}
            {!isEditing && (habit.description || habit.createdAt) && (
                <div className={`${styles.descriptionWrapper} ${showDescription ? styles.open : ""}`}>
                    <div className={styles.slideContent}>
                        {habit.description && <p>{habit.description}</p>}
                        {habit.createdAt && (
                            <p className={styles.createdAt}>Создано: {habit.createdAt}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Режим редактирования описания */}
            {isEditing && (
                <div className={styles.descriptionEditor}>
                    <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        rows={3}
                        placeholder="Описание привычки"
                    />
                    <button onClick={saveDescription} className="btn btn-success btn-sm">
                        Сохранить
                    </button>
                </div>
            )}
        </div>
    );
};

export default HourlyCard;
import { useState } from "react";
import base from "./HabitCard.module.scss";
import styles from "./HourlyCard.module.scss";
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
            className={`${base.card} ${doneHours.length === hours.length ? base.completed : ""}`}
            style={{ ["--color" as any]: habit.color }}
        >
            <div className={base.colorStripe} />

            <div className={`${base.content} ${styles.trimBottom}`}>
                <div className={base.header}>
                    <h3 className={base.title}>{habit.title}</h3>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className={base.edit} onClick={() => setIsEditing(p => !p)} title="Редактировать">✏️</button>
                        <button className={base.delete} onClick={() => onDelete(habit.id)} title="Удалить">🗑</button>
                    </div>
                </div>

                <div className={base.meta}>
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

                {isEditing && (
                    <div className={`${base.descriptionEditor} ${styles.hourlyDescriptionEditor}`}>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows={3}
                            className={`${base.descriptionInput} ${styles.hourlyDescriptionInput}`}
                            placeholder="Введите описание привычки..."
                        />
                        <div className={`${base.editorButtons} ${styles.hourlyEditorButtons}`}>
                            <button onClick={saveDescription} className={base.saveBtn}>Сохранить</button>
                            <button onClick={() => setIsEditing(false)} className={base.cancelBtn}>Отмена</button>
                        </div>
                    </div>
                )}
            </div>

                {(habit.description || habit.createdAt || isEditing) && (
                    <>
                        <div
                            className={`${base.slideTrigger} ${showDescription ? base.open : ""}`}
                            onClick={() => setShowDescription((p) => !p)}
                        >
                            <div className={base.slideArrow}></div>
                        </div>

                        <div className={`${base.descriptionWrapper} ${showDescription ? base.open : ""}`}>
                            <div className={base.slideContent}>
                                {habit.description && <p>{habit.description}</p>}
                                {habit.createdAt && (
                                    <p className={base.createdAt}>Создано: {habit.createdAt}</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
        </div>
    );
};

export default HourlyCard;
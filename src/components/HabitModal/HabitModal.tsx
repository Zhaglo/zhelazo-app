import { useState, useEffect, useRef } from "react";
import styles from "./HabitModal.module.scss";
import { Frequency } from "../../types/habit";
import { HabitModalProps } from "../../types/props";

const HabitModal = ({ onClose, onAddHabit }: HabitModalProps) => {
    const [title, setTitle] = useState("");
    const [frequency, setFrequency] = useState<Frequency>("daily");
    const [color, setColor] = useState("#3aaee0");
    const [description, setDescription] = useState("");
    const [timeFrom, setTimeFrom] = useState("08:00");
    const [timeTo, setTimeTo] = useState("20:00");
    const [interval, setInterval] = useState(1);
    const modalRef = useRef<HTMLDivElement>(null);

    // src/constants/habitColors.ts
    // src/constants/habitColors.ts
    // src/constants/habitColors.ts
    const colors = [
        '#B22222', // FireBrick — глубокий красно-рубиновый
        '#228B22', // ForestGreen — насыщенный тёмно-изумрудный
        '#1E90FF', // DodgerBlue — яркий, но холодный синий
        '#DAA520', // GoldenRod — тёплый золотисто-бронзовый
        '#8A2BE2', // BlueViolet — насыщенный фиолетовый
        '#00CED1', // DarkTurquoise — глубокий бирюзовый
        '#FF4500', // OrangeRed — энергичный терракотовый
        '#6A5ACD', // SlateBlue — чуть приглушённый яркий синий
    ];

    const handleSubmit = (e: React.FormEvent | KeyboardEvent) => {
        e.preventDefault?.();
        if (!title.trim()) return;

        const timeRange = frequency === "hourly"
            ? { from: timeFrom, to: timeTo, interval }
            : undefined;

        onAddHabit(title.trim(), color, frequency, description.trim() || undefined, timeRange);
        onClose();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                handleSubmit(e);
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [title, color, frequency, description, timeFrom, timeTo, interval]);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} ref={modalRef}>
                <h2>Новая привычка</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label>
                        Название:
                        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </label>

                    <label>
                        Тип:
                        <select value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)}>
                            <option value="daily">Ежедневная</option>
                            <option value="hourly">Ежечасная</option>
                            <option value="weekly">Еженедельная</option>
                        </select>
                    </label>

                    {frequency === "hourly" && (
                        <div className={styles.timeRange}>
                            <label>
                                С:
                                <input type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} />
                            </label>
                            <label>
                                До:
                                <input type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} />
                            </label>
                            <div className={styles.intervalPicker}>
                                <span>Каждые</span>
                                <select value={interval} onChange={(e) => setInterval(Number(e.target.value))}>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                                <span>часа</span>
                            </div>
                        </div>
                    )}

                    <label className={styles.fieldLabel}>Цвет:</label>

                    <div className={styles.colorChoices}>
                        {colors.map((c) => (
                            <button
                                key={c}
                                type="button"
                                className={`${styles.colorDot} ${color === c ? styles.selected : ""}`}
                                style={{ backgroundColor: c }}
                                onClick={() => setColor(c)}
                            />
                        ))}
                    </div>

                    <label>
                        Описание (необязательно):
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Краткое описание привычки"
                            style={{ resize: "none" }}
                        />
                    </label>

                    <div className={styles.actions}>
                        <button type="submit">Сохранить</button>
                        <button type="button" onClick={onClose}>Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HabitModal;
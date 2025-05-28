import React, { useState } from "react";
import styles from "./HabitForm.module.scss";

type Frequency = "daily" | "hourly" | "weekly";

interface HabitFormProps {
    onAddHabit: (
        title: string,
        color: string,
        frequency: Frequency,
        timeRange?: { from: string; to: string }
    ) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ onAddHabit }) => {
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#00bfff");
    const [frequency, setFrequency] = useState<Frequency>("daily");
    const [timeFrom, setTimeFrom] = useState("08:00");
    const [timeTo, setTimeTo] = useState("20:00");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const timeRange = frequency === "hourly" ? { from: timeFrom, to: timeTo } : undefined;
        onAddHabit(title, color, frequency, timeRange);
        setTitle("");
        setColor("#00bfff");
        setFrequency("daily");
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                placeholder="Название привычки"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            <select value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)}>
                <option value="daily">Ежедневно</option>
                <option value="hourly">Ежечасно</option>
                <option value="weekly">Раз в неделю</option>
            </select>
            {frequency === "hourly" && (
                <>
                    <label>
                        С:
                        <input type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} />
                    </label>
                    <label>
                        До:
                        <input type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} />
                    </label>
                </>
            )}
            <button type="submit" className="btn btn-success">Добавить</button>
        </form>
    );
};

export default HabitForm;
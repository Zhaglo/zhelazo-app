import React, { useState } from "react";
import styles from "./HabitForm.module.scss";

interface HabitFormProps {
    onAddHabit: (title: string, color: string) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ onAddHabit }) => {
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#00bfff");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddHabit(title, color);
        setTitle("");
        setColor("#00bfff");
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                placeholder="Название привычки"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={styles.input}
            />
            <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className={styles.color}
            />
            <button type="submit" className="btn btn-success">
                Добавить
            </button>
        </form>
    );
};

export default HabitForm;
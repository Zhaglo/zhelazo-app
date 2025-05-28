import React from "react";
import styles from "./HabitCard.module.scss";

interface HabitCardProps {
    id: string;
    title: string;
    color: string;
    completed: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
                                                 id,
                                                 title,
                                                 color,
                                                 completed,
                                                 onToggle,
                                                 onDelete,
                                             }) => {
    return (
        <li
            className={styles.card}
            style={{ borderLeft: `8px solid ${color}` }}
        >
            <label className={styles.label}>
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={() => onToggle(id)}
                />
                {title}
            </label>
            <button onClick={() => onDelete(id)} className="btn btn-outline btn-danger">
                ❌
            </button>
        </li>
    );
};

export default HabitCard;
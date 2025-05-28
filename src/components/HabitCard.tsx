import React from "react";

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
            style={{
                borderLeft: `8px solid ${color}`,
                padding: "8px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <label>
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={() => onToggle(id)}
                />{" "}
                {title}
            </label>
            <button onClick={() => onDelete(id)}>❌</button>
        </li>
    );
};

export default HabitCard;
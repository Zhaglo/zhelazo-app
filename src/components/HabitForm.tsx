import {useState} from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";

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
        <form onSubmit={handleSubmit}>
            <Input
                type="text"
                placeholder="Название привычки"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
            />
            <Button type="submit">Добавить</Button>
        </form>
    );
};

export default HabitForm;
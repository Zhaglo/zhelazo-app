import DailyCard from "./DailyCard";
import HourlyCard from "./HourlyCard";
import WeeklyCard from "./WeeklyCard";

import { DailyCardProps, HourlyCardProps, WeeklyCardProps } from "../../types/props";

interface Props extends DailyCardProps, HourlyCardProps, WeeklyCardProps {}

const HabitCard = ({ habit, onToggle, onDelete, today, weekKey }: Props) => {
    switch (habit.frequency) {
        case "daily":
            return <DailyCard habit={habit} onToggle={onToggle} onDelete={onDelete} today={today} />;
        case "hourly":
            return <HourlyCard habit={habit} onToggle={onToggle} onDelete={onDelete} today={today} />;
        case "weekly":
            return <WeeklyCard habit={habit} onToggle={onToggle} onDelete={onDelete} weekKey={weekKey} />;
        default:
            return null;
    }
};

export default HabitCard;
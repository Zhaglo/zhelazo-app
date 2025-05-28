import { Habit } from "./habit";

export interface BaseCardProps {
    habit: Habit;
    onToggle: (habitId: string, key: string) => void;
    onDelete: (habitId: string) => void;
}

export interface DailyCardProps extends BaseCardProps {
    today: string;
}

export interface HourlyCardProps extends BaseCardProps {
    today: string;
}

export interface WeeklyCardProps extends BaseCardProps {
    weekKey: string;
}
import { Habit } from "./habit";

export interface BaseCardProps {
    habit: Habit;
    onToggle: (habitId: string, key: string, extraKey?: string) => void;
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

import { Frequency, TimeRange } from "./habit";

export interface HabitModalProps {
    onClose: () => void;
    onAddHabit: (
        title: string,
        color: string,
        frequency: Frequency,
        description?: string,
        timeRange?: TimeRange
    ) => void;
}

export interface MotivationCardProps {
    user: string;
    username: string;
    avatar?: string;
    habit: string;
    streak: number;
    target?: number;
}
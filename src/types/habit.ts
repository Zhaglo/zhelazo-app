export type Frequency = "daily" | "hourly" | "weekly";

export interface TimeRange {
    from: string;
    to: string;
    interval?: number;
}

export interface Habit {
    id: string;
    title: string;
    color: string;
    createdAt: string; // ISO или DD.MM.YYYY
    days: Record<string, boolean>; // Ключ = дата, дата_время или неделя
    userId: string;
    frequency: Frequency;
    timeRange?: TimeRange;
    description?: string;
}
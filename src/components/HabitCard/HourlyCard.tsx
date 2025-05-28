import styles from "./HabitCard.module.scss";
import { HourlyCardProps } from "../../types/props";

const generateHours = (from: string, to: string): string[] => {
    const result: string[] = [];
    const start = parseInt(from.split(":")[0]);
    const end = parseInt(to.split(":")[0]);
    for (let h = start; h <= end; h++) {
        result.push(h.toString().padStart(2, "0") + ":00");
    }
    return result;
};

const getHourlyStreak = (habit: HourlyCardProps["habit"]): number => {
    if (!habit.timeRange) return 0;

    const allDates = Object.keys(habit.days || {})
        .map((key) => key.split("_")[0])
        .filter((v, i, a) => a.indexOf(v) === i); // уникальные даты

    const sorted = allDates.sort((a, b) => {
        const [d1, m1, y1] = a.split(".").map(Number);
        const [d2, m2, y2] = b.split(".").map(Number);
        return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
    });

    let max = 0;
    let current = 0;
    let lastDate: Date | null = null;

    for (const dateStr of sorted) {
        const hours = generateHours(habit.timeRange.from, habit.timeRange.to);
        const allMarked = hours.every((hour) => habit.days?.[`${dateStr}_${hour}`]);

        const [d, m, y] = dateStr.split(".").map(Number);
        const date = new Date(y, m - 1, d);

        if (allMarked) {
            if (lastDate && (date.getTime() - lastDate.getTime()) / (1000 * 3600 * 24) === 1) {
                current++;
            } else {
                current = 1;
            }

            max = Math.max(max, current);
            lastDate = date;
        } else {
            current = 0;
        }
    }

    return max;
};

const HourlyCard = ({ habit, onToggle, onDelete, today }: HourlyCardProps) => {
    const isAllHoursChecked = () => {
        if (!habit.timeRange) return false;
        const hours = generateHours(habit.timeRange.from, habit.timeRange.to);
        return hours.every((hour) => habit.days?.[`${today}_${hour}`]);
    };

    const handleToggleAll = () => {
        if (!habit.timeRange) return;
        const hours = generateHours(habit.timeRange.from, habit.timeRange.to);
        const shouldMarkAll = !isAllHoursChecked();
        hours.forEach((hour) => {
            const key = `${today}_${hour}`;
            const current = habit.days?.[key] || false;
            if (current !== shouldMarkAll) {
                onToggle(habit.id, key);
            }
        });
    };

    const streak = getHourlyStreak(habit);

    return (
        <div className={styles.card}>
            <div className={styles.colorStripe} style={{ backgroundColor: habit.color }} />
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{habit.title}</h3>
                    <button className={styles.delete} onClick={() => onDelete(habit.id)}>
                        🗑
                    </button>
                </div>

                <div className={styles.meta}>
                    <span>Создано: {habit.createdAt}</span>
                    <span>Дней подряд: {streak}</span>
                </div>

                {habit.timeRange && (
                    <>
                        <div className={styles.frequency}>
                            Каждый час: {habit.timeRange.from} – {habit.timeRange.to}
                        </div>

                        <div className={styles.hourlyList}>
                            {generateHours(habit.timeRange.from, habit.timeRange.to).map((hour) => {
                                const key = `${today}_${hour}`;
                                const checked = habit.days?.[key] || false;

                                return (
                                    <label key={hour} className={styles.hourCheckbox}>
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => onToggle(habit.id, key)}
                                        />
                                        {hour}
                                    </label>
                                );
                            })}
                        </div>
                    </>
                )}

                <label className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={isAllHoursChecked()}
                        onChange={handleToggleAll}
                    />
                    <span>Отметить на сегодня</span>
                </label>
            </div>
        </div>
    );
};

export default HourlyCard;
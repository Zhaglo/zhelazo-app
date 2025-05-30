import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from "chart.js";
import StatsBlock from "../components/StatsBlock";
import styles from "./StatsPage.module.scss";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface Habit {
    id: string;
    title: string;
    color: string;
    createdAt: string;
    days: Record<string, boolean>;
    userId: string;
    frequency: "daily" | "hourly" | "weekly";
    timeRange?: { from: string; to: string; interval?: number };
}

// генератор для hourly
const generateIntervalHours = (from: string, to: string, step: number = 1): string[] => {
    const result: string[] = [];
    const start = parseInt(from.split(":")[0]);
    const end = parseInt(to.split(":")[0]);

    for (let h = start; h <= end; h += step) {
        result.push(h.toString().padStart(2, "0") + ":00");
    }

    return result;
};

// универсальный подсчет "выполнений"
const countHabitCompletions = (habit: Habit): number => {
    const days = habit.days || {};

    if (habit.frequency === "daily") {
        return Object.entries(days)
            .filter(([key, done]) => done && !key.includes("_") && !key.includes("W"))
            .length;
    }

    if (habit.frequency === "hourly") {
        const dates = new Set<string>();

        Object.keys(days).forEach((key) => {
            if (key.includes("_")) {
                const [datePart] = key.split("_");
                dates.add(datePart);
            }
        });

        let count = 0;
        dates.forEach((date) => {
            const timeRange = habit.timeRange;
            if (!timeRange) return;

            const expectedHours = generateIntervalHours(timeRange.from, timeRange.to, timeRange.interval || 1);

            const doneForDay = expectedHours.every((hour) => {
                const key = `${date}_${hour}`;
                return !!days[key];
            });

            if (doneForDay) count++;
        });

        return count;
    }

    if (habit.frequency === "weekly") {
        const completedWeeks = Object.entries(days)
            .filter(([key, done]) => done && key.includes("W"))
            .length;
        return completedWeeks * 7;  // ✅ считаем как 7 дней за неделю!
    }

    return 0;
};

const StatsPage = () => {
    const userId = localStorage.getItem("token");
    const [habits, setHabits] = useState<Habit[]>([]);

    useEffect(() => {
        const allHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const userHabits = allHabits.filter((h: Habit) => h.userId === userId);
        setHabits(userHabits);
    }, [userId]);

    const totalHabits = habits.length;

    const totalCompletions = habits.reduce((acc, habit) => {
        return acc + countHabitCompletions(habit);
    }, 0);

    const maxStreak = (habit: Habit): number => {
        const dates = Object.entries(habit.days || {})
            .filter(([_, done]) => done)
            .map(([date]) => date)
            .sort();

        let streak = 0;
        let max = 0;
        let lastDate: Date | null = null;

        for (const dateStr of dates) {
            if (dateStr.includes("_") || dateStr.includes("W")) continue;

            const [day, month, year] = dateStr.split(".").map(Number);
            const date = new Date(year, month - 1, day);

            if (lastDate) {
                const diff = (date.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
                if (diff === 1) {
                    streak++;
                } else {
                    streak = 1;
                }
            } else {
                streak = 1;
            }

            max = Math.max(max, streak);
            lastDate = date;
        }

        return max;
    };

    const bestStreak = Math.max(...habits.map(maxStreak), 0);

    const sortedHabits = [...habits].sort((a, b) => {
        const aCount = countHabitCompletions(a);
        const bCount = countHabitCompletions(b);
        return bCount - aCount;  // по убыванию
    });

    // 👉 График "по привычкам"
    const chartData = {
        labels: sortedHabits.map((h) =>
            h.title.length > 15 ? h.title.slice(0, 15) + "…" : h.title
        ),
        datasets: [
            {
                label: "Количество выполнений",
                data: sortedHabits.map((h) => countHabitCompletions(h)),
                backgroundColor: sortedHabits.map((h) => h.color),
                borderRadius: 8,
            },
        ],
    };

    const chartOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const index = context.dataIndex;
                        const habit = habits[index];

                        let unit = "дней";
                        if (habit.frequency === "weekly") {
                            unit = "недель";
                        }

                        return `${unit.charAt(0).toUpperCase() + unit.slice(1)}: ${context.parsed.y}`;
                    },
                },
            },
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
        animations: {
            y: {
                duration: 800,
                easing: 'easeOutQuart',
            },
        },
    };

    // 👉 График "по дням недели"
    const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const completionsByDay: Record<number, number> = {
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
    };

    habits.forEach((habit) => {
        Object.entries(habit.days || {}).forEach(([key, done]) => {
            if (!done) return;

            if (habit.frequency === "daily" || habit.frequency === "hourly") {
                if (key.includes("_") || key.includes("W")) return;

                const [day, month, year] = key.split(".").map(Number);
                const date = new Date(year, month - 1, day);
                let dayOfWeek = date.getDay();
                dayOfWeek = (dayOfWeek + 6) % 7;
                completionsByDay[dayOfWeek]++;
            }

            if (habit.frequency === "weekly") {
                if (key.includes(".") && !key.includes("_") && !key.includes("W")) {
                    const [day, month, year] = key.split(".").map(Number);
                    const date = new Date(year, month - 1, day);
                    let dayOfWeek = date.getDay();
                    dayOfWeek = (dayOfWeek + 6) % 7;
                    completionsByDay[dayOfWeek]++;
                }
            }
        });
    });

    const dayChartData = {
        labels: daysOfWeek,
        datasets: [
            {
                label: "Выполнений по дням недели",
                data: daysOfWeek.map((_, i) => completionsByDay[i] || 0),
                backgroundColor: "#4caf50",
                borderRadius: 8,
            },
        ],
    };

    const dayChartOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `Выполнений: ${context.parsed.y}`,
                },
            },
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
        animations: {
            y: {
                duration: 800,
                easing: 'easeOutQuart',
            },
        },
    };

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>📊 Статистика</h2>

            <div className={styles.statsGrid}>
                <StatsBlock label="Всего привычек" value={totalHabits} />
                <StatsBlock label="Всего выполнений" value={totalCompletions} />
                <StatsBlock label="Максимальный стрик" value={`${bestStreak} дней подряд🔥`} />
            </div>

            {habits.length > 0 && (
                <>
                    <div className={styles.chartBlock}>
                        <h3>📈 Активность по привычкам</h3>
                        <div style={{ width: "100%", height: "400px" }}>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className={styles.chartBlock}>
                        <h3>📅 Активность по дням недели</h3>
                        <div style={{ width: "100%", height: "300px" }}>
                            <Bar data={dayChartData} options={dayChartOptions} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StatsPage;
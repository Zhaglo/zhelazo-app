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
import StatsBlock from "../../components/StatsBlock/StatsBlock";
import styles from "./StatsPage.module.scss";
import { Habit } from "../../types/habit";
import { generateIntervalHours } from "../../components/HabitCard/HourlyCard";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

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
        return completedWeeks * 7;
    }

    return 0;
};

const countWeeklyCompletions = (habit: Habit): number => {
    const completedWeeks = Object.entries(habit.days || {})
        .filter(([key, done]) => done && key.includes("W"))
        .length;
    return completedWeeks;
};

const getCompletionRate = (habit: Habit): number => {
    const today = new Date();
    const [createdDay, createdMonth, createdYear] = habit.createdAt.split(".").map(Number);
    const createdDate = new Date(createdYear, createdMonth - 1, createdDay);

    const diffInDays = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 3600 * 24)) + 1;

    if (diffInDays <= 0) return 0;

    if (habit.frequency === "daily" || habit.frequency === "hourly") {
        const completions = countHabitCompletions(habit);
        return Math.min(100, Math.round((completions / diffInDays) * 100));
    }

    if (habit.frequency === "weekly") {
        const weeksPassed = Math.floor(diffInDays / 7) || 1;
        const completions = Object.entries(habit.days || {})
            .filter(([key, done]) => done && key.includes("W"))
            .length;

        return Math.min(100, Math.round((completions / weeksPassed) * 100));
    }

    return 0;
};

// 🟢 Универсальный парсер "день недели"
const getHabitDayOfWeek = (habit: Habit): number[] => {
    const days = habit.days || {};
    const result: number[] = [];

    if (habit.frequency === "daily") {
        Object.entries(days).forEach(([key, done]) => {
            if (done && !key.includes("_") && !key.includes("W")) {
                const [d, m, y] = key.split(".").map(Number);
                const date = new Date(y, m - 1, d);
                const dow = (date.getDay() + 6) % 7;
                result.push(dow);
            }
        });
    }

    if (habit.frequency === "hourly") {
        const dates = new Set<string>();

        Object.keys(days).forEach((key) => {
            if (key.includes("_")) {
                const [datePart] = key.split("_");
                dates.add(datePart);
            }
        });

        dates.forEach((datePart) => {
            const timeRange = habit.timeRange;
            if (!timeRange) return;

            const expectedHours = generateIntervalHours(timeRange.from, timeRange.to, timeRange.interval || 1);

            const doneForDay = expectedHours.every((hour) => {
                const key = `${datePart}_${hour}`;
                return !!days[key];
            });

            if (doneForDay) {
                const [d, m, y] = datePart.split(".").map(Number);
                const date = new Date(y, m - 1, d);
                const dow = (date.getDay() + 6) % 7;
                result.push(dow);
            }
        });
    }

    if (habit.frequency === "weekly") {
        // ищем обычные date-ключи (НЕ W)
        Object.entries(days).forEach(([key, done]) => {
            if (done && key.includes(".") && !key.includes("_") && !key.includes("W")) {
                const [d, m, y] = key.split(".").map(Number);
                const date = new Date(y, m - 1, d);
                const dow = (date.getDay() + 6) % 7;
                result.push(dow);
            }
        });
    }

    return result;
};

const getLastNDates = (n: number): string[] => {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < n; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toLocaleDateString("ru-RU").split(".").join(".");
        dates.push(dateStr);
    }

    return dates;
};

const StatsPage = () => {
    const userId = localStorage.getItem("token");
    const [habits, setHabits] = useState<Habit[]>([]);
    const [filterType, setFilterType] = useState<"all" | "daily" | "hourly" | "weekly">("all");
    const [showTrend, setShowTrend] = useState(true);

    useEffect(() => {
        const allHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const userHabits = allHabits.filter((h: Habit) => h.userId === userId);
        setHabits(userHabits);
    }, [userId]);

    const filteredHabits = filterType === "all"
        ? habits
        : habits.filter(h => h.frequency === filterType);

    const totalHabits = filteredHabits.length;

    const totalCompletions = filteredHabits.reduce((acc, habit) => {
        if (habit.frequency === "weekly") {
            return acc + countWeeklyCompletions(habit); // +1 за неделю
        }
        return acc + countHabitCompletions(habit); // обычные дни
    }, 0);

    const maxStreak = (habit: Habit): number => {
        let dates: string[] = [];

        if (habit.frequency === "daily") {
            dates = Object.entries(habit.days || {})
                .filter(([key, done]) => done && !key.includes("_") && !key.includes("W"))
                .map(([date]) => date);
        }

        if (habit.frequency === "hourly") {
            const dateSet = new Set<string>();

            Object.keys(habit.days || {}).forEach((key) => {
                if (key.includes("_")) {
                    const [datePart] = key.split("_");
                    dateSet.add(datePart);
                }
            });

            dateSet.forEach((datePart) => {
                const timeRange = habit.timeRange;
                if (!timeRange) return;

                const expectedHours = generateIntervalHours(timeRange.from, timeRange.to, timeRange.interval || 1);

                const doneForDay = expectedHours.every((hour) => {
                    const k = `${datePart}_${hour}`;
                    return habit.days[k];
                });

                if (doneForDay) {
                    dates.push(datePart);
                }
            });
        }

        if (habit.frequency === "weekly") {
            // Для weekly — можно стрик по неделям (W)
            const weeks = Object.entries(habit.days || {})
                .filter(([key, done]) => done && key.includes("W"))
                .map(([key]) => key);

            // сортируем по неделям
            weeks.sort();

            let streak = 0;
            let max = 0;
            let lastWeekNum: number | null = null;
            let lastYear: number | null = null;

            for (const w of weeks) {
                const [yearStr, weekStr] = w.split("_W");
                const year = parseInt(yearStr);
                const week = parseInt(weekStr);

                if (lastWeekNum !== null && lastYear !== null) {
                    let expectedWeek: number = lastWeekNum + 1;
                    let expectedYear: number = lastYear;

                    // переход через год
                    if (expectedWeek > 52) {
                        expectedWeek = 1;
                        expectedYear++;
                    }

                    if (week === expectedWeek && year === expectedYear) {
                        streak++;
                    } else {
                        streak = 1;
                    }
                } else {
                    streak = 1;
                }

                max = Math.max(max, streak);
                lastWeekNum = week;
                lastYear = year;
            }

            return max;
        }

        // Для daily/hourly считаем по дням
        dates = dates.sort();

        let streak = 0;
        let max = 0;
        let lastDate: Date | null = null;

        for (const dateStr of dates) {
            const [d, m, y] = dateStr.split(".").map(Number);
            const date = new Date(y, m - 1, d);

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

    const bestStreak = Math.max(...filteredHabits.map(maxStreak), 0);

    const sortedHabits = [...filteredHabits].sort((a, b) => {
        const aCount = countHabitCompletions(a);
        const bCount = countHabitCompletions(b);
        return bCount - aCount;
    });

    const getTrend = (): string => {
        // Берем 7 дней назад и 7-14 дней назад
        const thisWeekDates = getLastNDates(7);
        const lastWeekDates = getLastNDates(14).slice(7);

        // Функция подсчета выполнений в списке дат
        const countInDates = (dates: string[]): number => {
            return sortedHabits.reduce((acc, habit) => {
                const days = habit.days || {};

                if (habit.frequency === "daily") {
                    return acc + dates.filter(d => days[d]).length;
                }

                if (habit.frequency === "hourly") {
                    return acc + dates.filter(date => {
                        const timeRange = habit.timeRange;
                        if (!timeRange) return false;

                        const expectedHours = generateIntervalHours(timeRange.from, timeRange.to, timeRange.interval || 1);
                        return expectedHours.every(hour => !!days[`${date}_${hour}`]);
                    }).length;
                }

                if (habit.frequency === "weekly") {
                    // Смотрим есть ли дата в habit.days[дата]
                    return acc + dates.filter(d => days[d]).length;
                }

                return acc;
            }, 0);
        };

        const thisWeekCount = countInDates(thisWeekDates);
        const lastWeekCount = countInDates(lastWeekDates);

        // Считаем тренд
        if (lastWeekCount === 0 && thisWeekCount === 0) {
            return "Недостаточно данных для тренда";
        }

        if (lastWeekCount === 0 && thisWeekCount > 0) {
            return `📈 Прогресс вырос (новая активность!)`;
        }

        const diff = thisWeekCount - lastWeekCount;
        const percent = Math.abs(Math.round((diff / lastWeekCount) * 100));

        if (diff > 0) {
            return `📈 Прогресс вырос на +${percent}%`;
        } else if (diff < 0) {
            return `📉 Прогресс снизился на -${percent}%`;
        } else {
            return `➡️ Прогресс без изменений`;
        }
    };

    const chartData = {
        labels: sortedHabits.map((h) =>
            h.title.length > 15 ? h.title.slice(0, 15) + "…" : h.title
        ),
        datasets: [
            {
                label: "Количество выполнений",
                data: sortedHabits.map((h) => {
                    if (h.frequency === "weekly") {
                        return countWeeklyCompletions(h) * 7; // высота бара = 7 дней за неделю
                    }
                    return countHabitCompletions(h);
                }),
                backgroundColor: sortedHabits.map((h) => h.color),
                borderRadius: 8,
            },
        ],
    };

    const darkAxis = {
        ticks: {
            color: "#eaeaea", // ← белый/светлый
            font: { size: 12 },
        },
        grid: {
            color: "rgba(255,255,255,0.07)",   // тонкая сетка
        },
    } as const;

    const chartOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const index = context.dataIndex;
                        const habit = sortedHabits[index];

                        let unit = "дней";
                        let completions = countHabitCompletions(habit);

                        if (habit.frequency === "weekly") {
                            unit = "недель";
                            completions = countWeeklyCompletions(habit); // показываем кол-во недель
                        }

                        const rate = getCompletionRate(habit);

                        return `${unit.charAt(0).toUpperCase() + unit.slice(1)}: ${completions} (${rate}%)`;
                    },
                },
                titleColor: "#ffffff",
                bodyColor:  "#ffffff",
            },
        },
        scales: {
            x: { ...darkAxis },
            y: { ...darkAxis, beginAtZero: true, ticks: { ...darkAxis.ticks, stepSize: 1 } },
        },
        animations: {
            y: {
                duration: 800,
                easing: 'easeOutQuart',
            },
        },
    };

    const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const completionsByDay: Record<number, number> = {
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
    };

    filteredHabits.forEach((habit) => {
        const dows = getHabitDayOfWeek(habit);
        dows.forEach((dow) => {
            completionsByDay[dow]++;
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
            x: { ...darkAxis },
            y: { ...darkAxis, beginAtZero: true, ticks: { ...darkAxis.ticks, stepSize: 1 } },
        },
        animations: {
            y: {
                duration: 800,
                easing: 'easeOutQuart',
            },
        },
    };

    function pluralize(count: number, forms: [string, string, string]) {
        const mod10 = count % 10;
        const mod100 = count % 100;

        if (mod10 === 1 && mod100 !== 11) {
            return forms[0];
        } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
            return forms[1];
        } else {
            return forms[2];
        }
    }

    const unitForms = filterType === "weekly"
        ? ["неделя", "недели", "недель"] as unknown as [string, string, string]
        : ["день", "дня", "дней"] as unknown as [string, string, string];

    const unitText = pluralize(bestStreak, unitForms);

    const trendText = getTrend();
    let trendClass = "";

    if (trendText.includes("📈")) {
        trendClass = styles.trendUp;
    } else if (trendText.includes("📉")) {
        trendClass = styles.trendDown;
    } else {
        trendClass = styles.trendNeutral;
    }

    return (
        <div className={styles.wrapper}>

            <div className={styles.filterRow}>
                <label>Тип привычек:</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
                    <option value="all">Все</option>
                    <option value="daily">Ежедневные</option>
                    <option value="hourly">Ежечасные</option>
                    <option value="weekly">Еженедельные</option>
                </select>
            </div>

            <div className={styles.statsGrid}>
                <StatsBlock label="Всего привычек" value={totalHabits} />
                <StatsBlock label="Всего выполнений" value={totalCompletions} />
                <StatsBlock
                    label="Максимальный стрик"
                    value={`${bestStreak} ${unitText} подряд🔥`}
                />
            </div>

            {filteredHabits.length > 0 && (
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

            {showTrend && (
                <div className={`${styles.trendToast} ${trendClass}`}>
                    {getTrend()}
                    <button onClick={() => setShowTrend(false)}>&times;</button>
                </div>
            )}
        </div>
    );
};

export default StatsPage;
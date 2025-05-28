const fakeAchievements = [
    {
        user: "Алина",
        habit: "Утренняя зарядка",
        streak: 45,
        color: "#ff7f50",
    },
    {
        user: "Михаил",
        habit: "Чтение каждый день",
        streak: 30,
        color: "#4caf50",
    },
    {
        user: "Катя",
        habit: "Пить воду",
        streak: 60,
        color: "#2196f3",
    },
];

const motivationalQuotes = [
    "Твои привычки формируют твою судьбу.",
    "Сила — в регулярности.",
    "Сегодня ты — лучше, чем вчера.",
];

const MotivationPage = () => {
    return (
        <div>
            <h2>Мотивация</h2>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {fakeAchievements.map((item, i) => (
                    <li
                        key={i}
                        style={{
                            borderLeft: `8px solid ${item.color}`,
                            padding: "12px",
                            marginBottom: "12px",
                            background: "#f9f9f9",
                            borderRadius: "6px",
                        }}
                    >
                        <strong>{item.user}</strong> поддерживает привычку <em>"{item.habit}"</em> уже{" "}
                        <strong>{item.streak} дней подряд</strong> 💪
                    </li>
                ))}
            </ul>

            <hr />

            <div style={{ marginTop: "2rem" }}>
                <h3>Цитата дня:</h3>
                <p style={{ fontStyle: "italic", fontSize: "1.1rem" }}>
                    {motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}
                </p>
            </div>
        </div>
    );
};

export default MotivationPage;
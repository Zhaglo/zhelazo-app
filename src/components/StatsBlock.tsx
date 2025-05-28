import React from "react";

interface StatsBlockProps {
    label: string;
    value: string | number;
}

const StatsBlock: React.FC<StatsBlockProps> = ({ label, value }) => {
    return (
        <div
            style={{
                background: "#f2f2f2",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
        >
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</div>
            <div style={{ color: "#555" }}>{label}</div>
        </div>
    );
};

export default StatsBlock;
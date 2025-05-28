import React from "react";

interface QuoteCardProps {
    text: string;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ text }) => {
    return (
        <blockquote
            style={{
                fontStyle: "italic",
                fontSize: "1.1rem",
                marginTop: "1rem",
                padding: "1rem",
                background: "#f4f4f4",
                borderLeft: "4px solid #ccc",
            }}
        >
            {text}
        </blockquote>
    );
};

export default QuoteCard;
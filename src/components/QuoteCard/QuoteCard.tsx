import React from "react";
import styles from "./QuoteCard.module.scss";

interface QuoteCardProps {
    text: string;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ text }) => {
    return <blockquote className={styles.card}>{text}</blockquote>;
};

export default QuoteCard;
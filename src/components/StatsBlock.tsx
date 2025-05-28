import React from "react";
import styles from "./StatsBlock.module.scss";

interface StatsBlockProps {
    label: string;
    value: string | number;
}

const StatsBlock: React.FC<StatsBlockProps> = ({ label, value }) => {
    return (
        <div className={styles.block}>
            <div className={styles.value}>{value}</div>
            <div className={styles.label}>{label}</div>
        </div>
    );
};

export default StatsBlock;
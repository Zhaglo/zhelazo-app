import React from "react";
import styles from "./UserBadge.module.scss";

interface UserBadgeProps {
    username: string;
    email: string;
}

const UserBadge: React.FC<UserBadgeProps> = ({ username, email }) => {
    return (
        <div className={styles.badge}>
            <p className={styles.field}>
                <strong>Имя:</strong> {username}
            </p>
            <p className={styles.field}>
                <strong>Email:</strong> {email}
            </p>
        </div>
    );
};

export default UserBadge;
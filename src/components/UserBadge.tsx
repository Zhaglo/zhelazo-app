import React from "react";

interface UserBadgeProps {
    username: string;
    email: string;
}

const UserBadge: React.FC<UserBadgeProps> = ({ username, email }) => {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "6px",
                backgroundColor: "#f9f9f9",
                maxWidth: "400px",
            }}
        >
            <p><strong>Имя:</strong> {username}</p>
            <p><strong>Email:</strong> {email}</p>
        </div>
    );
};

export default UserBadge;
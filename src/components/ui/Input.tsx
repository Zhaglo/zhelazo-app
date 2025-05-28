import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
    return (
        <div style={{ marginBottom: "1rem" }}>
            {label && <label style={{ display: "block", marginBottom: "4px" }}>{label}</label>}
            <input
                {...props}
                style={{
                    padding: "0.5rem",
                    width: "100%",
                    maxWidth: "400px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                }}
            />
        </div>
    );
};

export default Input;
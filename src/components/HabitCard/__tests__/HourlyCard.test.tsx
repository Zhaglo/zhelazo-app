import { render, screen, fireEvent } from '@testing-library/react';
import HourlyCard, { generateIntervalHours } from '../HourlyCard';
import { HourlyCardProps } from '../../../types/props';
import { Habit } from '../../../types/habit';

const mockHabit: Habit = {
    id: '2',
    title: 'Hourly Test Habit',
    color: '#0000ff',
    createdAt: '31.05.2025',
    days: {
        '31.05.2025_08:00': true,
        '31.05.2025_09:00': false,
    },
    userId: 'user-2',
    frequency: 'hourly',
    timeRange: {
        from: '08:00',
        to: '09:00',
        interval: 1
    },
    description: 'Test description',
};

const defaultProps: HourlyCardProps = {
    habit: mockHabit,
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    today: '31.05.2025',
};

describe('HourlyCard component', () => {
    test('renders habit title', () => {
        render(<HourlyCard {...defaultProps} />);

        const titleElement = screen.getByText(/Hourly Test Habit/i);
        expect(titleElement).toBeInTheDocument();
    });

    test('renders progress info', () => {
        render(<HourlyCard {...defaultProps} />);

        const progressElement = screen.getByText(/Выполнено:/i);
        expect(progressElement).toBeInTheDocument();
    });

    test('renders edit and delete buttons', () => {
        render(<HourlyCard {...defaultProps} />);

        const editButton = screen.getByTitle(/Редактировать/i);
        const deleteButton = screen.getByTitle(/Удалить/i);

        expect(editButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
    });

    test('opens description editor on edit button click', () => {
        render(<HourlyCard {...defaultProps} />);

        const editButton = screen.getByTitle(/Редактировать/i);
        fireEvent.click(editButton);

        const textarea = screen.getByPlaceholderText(/Введите описание привычки.../i);
        expect(textarea).toBeInTheDocument();
    });
});
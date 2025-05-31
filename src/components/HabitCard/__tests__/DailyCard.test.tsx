import { render, screen, fireEvent } from '@testing-library/react';
import DailyCard from '../DailyCard';
import { DailyCardProps } from '../../../types/props';
import { Habit } from '../../../types/habit';

const mockHabit: Habit = {
    id: '1',
    title: 'Daily Test Habit',
    color: '#00ff00',
    createdAt: '31.05.2025',
    days: {
        '31.05.2025': true,
        '30.05.2025': true,
        '29.05.2025': true
    },
    userId: 'user-1',
    frequency: 'daily',
    timeRange: {
        from: '08:00',
        to: '10:00',
    },
    description: 'Test description',
};

const defaultProps: DailyCardProps = {
    habit: mockHabit,
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    today: '31.05.2025',
};

describe('DailyCard component', () => {
    test('renders habit title', () => {
        render(<DailyCard {...defaultProps} />);

        const titleElement = screen.getByText(/Daily Test Habit/i);
        expect(titleElement).toBeInTheDocument();
    });

    test('renders streak info', () => {
        render(<DailyCard {...defaultProps} />);

        const streakElement = screen.getByText(/Дней подряд:/i);
        expect(streakElement).toBeInTheDocument();
    });

    test('renders edit and delete buttons', () => {
        render(<DailyCard {...defaultProps} />);

        const editButton = screen.getByTitle(/Редактировать/i);
        const deleteButton = screen.getByTitle(/Удалить/i);

        expect(editButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
    });

    test('opens description editor on edit button click', () => {
        render(<DailyCard {...defaultProps} />);

        const editButton = screen.getByTitle(/Редактировать/i);
        fireEvent.click(editButton);

        const textarea = screen.getByPlaceholderText(/Введите описание привычки.../i);
        expect(textarea).toBeInTheDocument();
    });
});
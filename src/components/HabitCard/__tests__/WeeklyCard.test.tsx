import { render, screen, fireEvent } from '@testing-library/react';
import WeeklyCard from '../WeeklyCard';
import { WeeklyCardProps } from '../../../types/props';
import { Habit } from '../../../types/habit';

const mockHabit: Habit = {
    id: '3',
    title: 'Weekly Test Habit',
    color: '#ffaa00',
    createdAt: '31.05.2025',
    days: {
        '2025-W22': true,
        '2025-W21': true,
    },
    userId: 'user-3',
    frequency: 'weekly',
    description: 'Test description',
};

const defaultProps: WeeklyCardProps = {
    habit: mockHabit,
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    weekKey: '2025-W22',
};

describe('WeeklyCard component', () => {
    test('renders habit title', () => {
        render(<WeeklyCard {...defaultProps} />);

        const titleElement = screen.getByText(/Weekly Test Habit/i);
        expect(titleElement).toBeInTheDocument();
    });

    test('renders week streak info', () => {
        render(<WeeklyCard {...defaultProps} />);

        const streakElement = screen.getByText(/Недель подряд:/i);
        expect(streakElement).toBeInTheDocument();
    });

    test('renders edit and delete buttons', () => {
        render(<WeeklyCard {...defaultProps} />);

        const editButton = screen.getByTitle(/Редактировать/i);
        const deleteButton = screen.getByTitle(/Удалить/i);

        expect(editButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
    });

    test('opens description editor on edit button click', () => {
        render(<WeeklyCard {...defaultProps} />);

        const editButton = screen.getByTitle(/Редактировать/i);
        fireEvent.click(editButton);

        const textarea = screen.getByPlaceholderText(/Введите описание привычки.../i);
        expect(textarea).toBeInTheDocument();
    });
});
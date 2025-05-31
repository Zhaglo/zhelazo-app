import { render, screen } from '@testing-library/react';
import HabitCard from '../HabitCard';
import { Habit } from '../../../types/habit';

const mockHabit: Habit = {
    id: '1',
    title: 'Test Daily Habit',
    color: '#00ff00',
    createdAt: new Date().toISOString(),
    days: {},
    userId: 'user-1',
    frequency: 'daily',
    timeRange: {
        from: '08:00',
        to: '10:00',
    },
    description: 'Test description',
};

describe('HabitCard component', () => {
    test('renders DailyCard when habit is daily', () => {
        render(
            <HabitCard
                habit={mockHabit}
                onToggle={() => {}}
                onDelete={() => {}}
                today={'31.05.2025'}
                weekKey=""
            />
        );

        // Так как title рендерится в DailyCard, проверяем его наличие
        const titleElement = screen.getByText(/Test Daily Habit/i);
        expect(titleElement).toBeInTheDocument();
    });
});
import { render, screen, fireEvent } from '@testing-library/react';
import HabitModal from '../HabitModal';
import { HabitModalProps } from '../../../types/props';

const defaultProps: HabitModalProps = {
    onClose: jest.fn(),
    onAddHabit: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks(); // очищаем моки перед каждым тестом
});

describe('HabitModal component', () => {
    test('renders modal title', () => {
        render(<HabitModal {...defaultProps} />);

        const titleElement = screen.getByText(/Новая привычка/i);
        expect(titleElement).toBeInTheDocument();
    });

    test('can enter title and description', () => {
        render(<HabitModal {...defaultProps} />);

        const titleInput = screen.getByLabelText(/Название/i);
        const descTextarea = screen.getByPlaceholderText(/Краткое описание привычки/i);

        fireEvent.change(titleInput, { target: { value: 'Test Habit' } });
        fireEvent.change(descTextarea, { target: { value: 'Test description' } });

        expect(titleInput).toHaveValue('Test Habit');
        expect(descTextarea).toHaveValue('Test description');
    });

    test('can change frequency', () => {
        render(<HabitModal {...defaultProps} />);

        const select = screen.getByLabelText(/Тип/i);
        fireEvent.change(select, { target: { value: 'weekly' } });

        expect(select).toHaveValue('weekly');
    });

    test('calls onAddHabit when form is submitted (daily)', () => {
        render(<HabitModal {...defaultProps} />);

        const titleInput = screen.getByLabelText(/Название/i);
        const saveButton = screen.getByText(/^Сохранить$/i); // ^$ чтобы не поймать кнопку "Сохранить" в редакторе

        fireEvent.change(titleInput, { target: { value: 'New Habit' } });
        fireEvent.click(saveButton);

        expect(defaultProps.onAddHabit).toHaveBeenCalledWith(
            'New Habit',
            expect.any(String), // цвет
            'daily',            // frequency по умолчанию
            undefined,          // description пустая → undefined
            undefined           // timeRange для daily → undefined
        );

        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    test('calls onAddHabit when form is submitted (hourly)', () => {
        render(<HabitModal {...defaultProps} />);

        const titleInput = screen.getByLabelText(/Название/i);
        const select = screen.getByLabelText(/Тип/i);
        const saveButton = screen.getByText(/^Сохранить$/i);

        fireEvent.change(titleInput, { target: { value: 'Hourly Habit' } });
        fireEvent.change(select, { target: { value: 'hourly' } });

        fireEvent.click(saveButton);

        expect(defaultProps.onAddHabit).toHaveBeenCalledWith(
            'Hourly Habit',
            expect.any(String), // цвет
            'hourly',
            undefined,          // description пустая
            expect.objectContaining({
                from: expect.any(String),
                to: expect.any(String),
                interval: expect.any(Number),
            })
        );

        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    test('calls onClose when Cancel button is clicked', () => {
        render(<HabitModal {...defaultProps} />);

        const cancelButton = screen.getByText(/Отмена/i);
        fireEvent.click(cancelButton);

        expect(defaultProps.onClose).toHaveBeenCalled();
    });
});
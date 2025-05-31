describe('Zhelazo App E2E Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000', {
            onBeforeLoad(win) {
                win.localStorage.setItem('token', 'FAKE_TOKEN_FOR_TESTS');
                win.localStorage.setItem('user', JSON.stringify({
                    id: 'user-1',
                    email: 'test@test.com',
                    name: 'Test User'
                }));
            }
        });

        cy.url().should('include', '/dashboard');
    });

    it('opens main page', () => {
        cy.get('body').then(($body) => {
            if ($body.text().includes('У вас пока нет привычек.')) {
                cy.contains('У вас пока нет привычек.').should('be.visible');
            } else {
                cy.contains('ЕЖЕДНЕВНЫЕ ПРИВЫЧКИ').should('be.visible');
                cy.contains('Добавить привычку').should('be.visible');
            }
        });
    });

    it('opens HabitModal when clicking Add button', () => {
        cy.contains('Добавить привычку').click();
        cy.contains('Новая привычка').should('be.visible');
    });

    it('can add new daily habit', () => {
        cy.contains('Добавить привычку').click();

        cy.get('input').first().type('Daily Cypress Habit');
        cy.contains(/^Сохранить$/i).click();

        cy.contains('Daily Cypress Habit').should('exist');
    });

    it('can add new hourly habit', () => {
        cy.contains('Добавить привычку').click();

        cy.get('input').first().type('Hourly Cypress Habit');
        cy.get('select').select('Ежечасная');

        cy.get('input[type="time"]').first().clear().type('09:00');
        cy.get('input[type="time"]').last().clear().type('18:00');
        cy.get('select').last().select('2');

        cy.contains(/^Сохранить$/i).click();

        cy.contains('Hourly Cypress Habit').should('exist');
    });

    it('can add new weekly habit', () => {
        cy.contains('Добавить привычку').click();

        cy.get('input').first().type('Weekly Cypress Habit');
        cy.get('select').select('Еженедельная');

        cy.contains(/^Сохранить$/i).click();

        cy.contains('Weekly Cypress Habit').should('exist');
    });

    it('can navigate to profile page and edit profile', () => {
        cy.get('header').contains('Профиль').click();
        cy.url().should('include', '/profile');

        cy.contains('Редактировать профиль').should('exist').click();

        cy.contains('✏️ Редактировать профиль').should('exist');

        cy.get('input').eq(1).clear().type('Cypress User');
        cy.get('input').eq(3).clear().type('cypress@test.com');

        cy.contains('Сохранить').click();

        cy.contains('✏️ Редактировать профиль').should('not.exist');
        cy.contains('Cypress User').should('exist');
        cy.contains('📧 cypress@test.com').should('exist');
    });

    it('can return to dashboard', () => {
        cy.get('header').contains('Главная').click();
        cy.url().should('include', '/dashboard');

        cy.get('body').then(($body) => {
            if ($body.text().includes('У вас пока нет привычек.')) {
                cy.contains('У вас пока нет привычек.').should('be.visible');
            } else {
                cy.contains('ЕЖЕДНЕВНЫЕ ПРИВЫЧКИ').should('be.visible');
            }
        });
    });

    it('can navigate to Stats page', () => {
        cy.get('header').contains('Статистика').click();
        cy.url().should('include', '/stats');

        // Проверяем наличие заголовков/блоков статистики
        cy.contains('Всего привычек').should('exist');
        cy.contains('Всего выполнений').should('exist');
        cy.contains('Максимальный стрик').should('exist');

        // Если есть привычки — тогда проверяем графики
        cy.get('body').then(($body) => {
            if ($body.text().includes('Активность по привычкам')) {
                cy.contains('Активность по привычкам').should('exist');
                cy.contains('Активность по дням недели').should('exist');
            }
        });
    });

    it('can navigate to Motivation page', () => {
        cy.get('header').contains('Мотивация').click();
        cy.url().should('include', '/motivation');

        // Проверяем что мотивационная страница открылась — например по заголовку
        cy.contains('Мотивация').should('exist');
    });
});
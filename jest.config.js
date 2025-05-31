module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '\\.module\\.(css|scss)$': 'identity-obj-proxy',
        '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};
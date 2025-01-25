
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/graphqltests.test.jsx'],
  testEnvironment: 'jsdom', // <-- Change this line
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
}

module.exports = createJestConfig(customJestConfig)
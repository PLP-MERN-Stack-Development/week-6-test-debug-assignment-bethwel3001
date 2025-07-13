# MERN Stack Testing Application

This is a comprehensive MERN (MongoDB, Express, React, Node.js) application with complete testing setup including unit, integration, and end-to-end tests.

## Features

- Full test coverage with Jest, React Testing Library, and Cypress
- Authentication system with JWT
- CRUD operations for posts
- Error handling and logging
- Performance monitoring

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (or use in-memory for tests)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/mern-testing.git
   cd mern-testing
   ```
2. Running the Application
   Start both client and server in development mode:
   ```bash
   npm start
   ```
3. Running Tests
  ```bash
  npm test
  ```
4. Run specific test suites:
  ```bash
  # Server unit tests
npm run test:server:unit

# Server integration tests
npm run test:server:integration

# Client unit tests
npm run test:client:unit

# Client integration tests
npm run test:client:integration

# End-to-end tests
npm run test:e2e

# Generate coverage reports
npm run coverage
  ```
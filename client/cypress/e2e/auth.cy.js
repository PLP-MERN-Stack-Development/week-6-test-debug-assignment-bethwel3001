describe('Authentication Flows', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  
  it('should allow user to register', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/register`, {
      statusCode: 201,
      body: {
        token: 'test-token',
        user: {
          username: 'newuser',
          email: 'new@example.com'
        }
      }
    }).as('registerRequest');
    
    cy.get('[data-testid="register-link"]').click();
    
    cy.get('[data-testid="username-input"]').type('newuser');
    cy.get('[data-testid="email-input"]').type('new@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="register-button"]').click();
    
    cy.wait('@registerRequest');
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, newuser').should('be.visible');
  });
  
  it('should allow user to login', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/login`, {
      statusCode: 200,
      body: {
        token: 'test-token',
        user: {
          username: 'testuser',
          email: 'test@example.com'
        }
      }
    }).as('loginRequest');
    
    cy.get('[data-testid="login-link"]').click();
    
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    
    cy.wait('@loginRequest');
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, testuser').should('be.visible');
  });
  
  it('should show error for invalid login', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/login`, {
      statusCode: 401,
      body: {
        error: 'Invalid credentials'
      }
    }).as('loginRequest');
    
    cy.get('[data-testid="login-link"]').click();
    
    cy.get('[data-testid="email-input"]').type('wrong@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();
    
    cy.wait('@loginRequest');
    cy.contains('Invalid credentials').should('be.visible');
  });
});
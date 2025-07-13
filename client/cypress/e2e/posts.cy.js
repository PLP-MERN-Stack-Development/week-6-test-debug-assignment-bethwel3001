describe('Posts Management', () => {
  before(() => {
    // Login first
    cy.login('test@example.com', 'password123');
  });
  
  it('should display list of posts', () => {
    cy.intercept('GET', `${Cypress.env('apiUrl')}/posts`, {
      fixture: 'posts.json'
    }).as('getPosts');
    
    cy.visit('/posts');
    cy.wait('@getPosts');
    
    cy.get('[data-testid="post-item"]').should('have.length.at.least', 1);
  });
  
  it('should create a new post', () => {
    cy.intercept('POST', `${Cypress.env('apiUrl')}/posts`, {
      statusCode: 201,
      body: {
        _id: '123',
        title: 'New Test Post',
        content: 'Test content',
        author: 'testuser'
      }
    }).as('createPost');
    
    cy.visit('/posts/new');
    
    cy.get('[data-testid="title-input"]').type('New Test Post');
    cy.get('[data-testid="content-textarea"]').type('Test content');
    cy.get('[data-testid="submit-button"]').click();
    
    cy.wait('@createPost');
    cy.url().should('include', '/posts/123');
    cy.contains('New Test Post').should('be.visible');
  });
  
  it('should edit an existing post', () => {
    const postId = '123';
    cy.intercept('GET', `${Cypress.env('apiUrl')}/posts/${postId}`, {
      fixture: 'singlePost.json'
    }).as('getPost');
    
    cy.intercept('PUT', `${Cypress.env('apiUrl')}/posts/${postId}`, {
      statusCode: 200,
      body: {
        _id: postId,
        title: 'Updated Post',
        content: 'Updated content',
        author: 'testuser'
      }
    }).as('updatePost');
    
    cy.visit(`/posts/${postId}/edit`);
    cy.wait('@getPost');
    
    cy.get('[data-testid="title-input"]').clear().type('Updated Post');
    cy.get('[data-testid="content-textarea"]').clear().type('Updated content');
    cy.get('[data-testid="submit-button"]').click();
    
    cy.wait('@updatePost');
    cy.url().should('include', `/posts/${postId}`);
    cy.contains('Updated Post').should('be.visible');
  });
  
  it('should delete a post', () => {
    const postId = '123';
    cy.intercept('DELETE', `${Cypress.env('apiUrl')}/posts/${postId}`, {
      statusCode: 200
    }).as('deletePost');
    
    cy.visit(`/posts/${postId}`);
    cy.get('[data-testid="delete-button"]').click();
    cy.get('[data-testid="confirm-delete-button"]').click();
    
    cy.wait('@deletePost');
    cy.url().should('include', '/posts');
    cy.contains('Post deleted successfully').should('be.visible');
  });
});
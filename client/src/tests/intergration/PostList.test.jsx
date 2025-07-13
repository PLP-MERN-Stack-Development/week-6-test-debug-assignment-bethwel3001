import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import PostList from '../../components/PostList';
import { PostsProvider } from '../../context/PostsContext';

const mockPosts = [
  { _id: '1', title: 'First Post', excerpt: 'First post content', slug: 'first-post' },
  { _id: '2', title: 'Second Post', excerpt: 'Second post content', slug: 'second-post' }
];

const server = setupServer(
  rest.get('/api/posts', (req, res, ctx) => {
    return res(ctx.json(mockPosts));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('PostList Component', () => {
  it('fetches and displays posts', async () => {
    render(
      <MemoryRouter>
        <PostsProvider>
          <PostList />
        </PostsProvider>
      </MemoryRouter>
    );
    
    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.getAllByRole('link')).toHaveLength(2);
    });
  });
  
  it('displays error message when fetch fails', async () => {
    server.use(
      rest.get('/api/posts', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );
    
    render(
      <MemoryRouter>
        <PostsProvider>
          <PostList />
        </PostsProvider>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch posts/i)).toBeInTheDocument();
    });
  });
});
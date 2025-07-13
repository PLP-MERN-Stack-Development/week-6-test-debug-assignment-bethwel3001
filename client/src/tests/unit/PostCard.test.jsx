import React from 'react';
import { render, screen } from '@testing-library/react';
import PostCard from '../../components/PostCard';
import { MemoryRouter } from 'react-router-dom';

const mockPost = {
  _id: '1',
  title: 'Test Post',
  excerpt: 'This is a test post excerpt',
  author: { username: 'testuser' },
  createdAt: new Date().toISOString(),
  slug: 'test-post'
};

describe('PostCard Component', () => {
  it('renders post information correctly', () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument();
    expect(screen.getByText(`by ${mockPost.author.username}`)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', `/posts/${mockPost.slug}`);
  });
  
  it('renders correctly with minimal props', () => {
    const minimalPost = {
      _id: '2',
      title: 'Minimal Post',
      author: { username: 'minimaluser' },
      createdAt: new Date().toISOString(),
      slug: 'minimal-post'
    };
    
    render(
      <MemoryRouter>
        <PostCard post={minimalPost} />
      </MemoryRouter>
    );
    
    expect(screen.getByText(minimalPost.title)).toBeInTheDocument();
    expect(screen.getByText(`by ${minimalPost.author.username}`)).toBeInTheDocument();
  });
});
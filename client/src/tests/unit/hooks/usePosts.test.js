import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import usePosts from '../../hooks/usePosts';

describe('usePosts Hook', () => {
  let mockAxios;
  
  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });
  
  afterEach(() => {
    mockAxios.restore();
  });
  
  it('fetches posts successfully', async () => {
    const mockPosts = [
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' }
    ];
    
    mockAxios.onGet('/api/posts').reply(200, mockPosts);
    
    const { result, waitForNextUpdate } = renderHook(() => usePosts());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    
    await waitForNextUpdate();
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.posts).toEqual(mockPosts);
  });
  
  it('handles fetch error', async () => {
    mockAxios.onGet('/api/posts').reply(500, { error: 'Server error' });
    
    const { result, waitForNextUpdate } = renderHook(() => usePosts());
    
    await waitForNextUpdate();
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch posts');
    expect(result.current.posts).toEqual([]);
  });
  
  it('creates a new post', async () => {
    const newPost = { title: 'New Post', content: 'Content' };
    const createdPost = { id: 3, ...newPost };
    
    mockAxios.onPost('/api/posts').reply(201, createdPost);
    mockAxios.onGet('/api/posts').reply(200, [createdPost]);
    
    const { result, waitForNextUpdate } = renderHook(() => usePosts());
    
    await act(async () => {
      await result.current.createPost(newPost);
    });
    
    expect(result.current.posts).toContainEqual(createdPost);
  });
});
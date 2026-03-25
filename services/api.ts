// Centralized API Service
// Industry standard practice to separate all network calls from UI components

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Data shapes
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export const api = {
  // Posts
  getPosts: async (page = 1, limit = 10): Promise<Post[]> => {
    const res = await fetch(`${BASE_URL}/posts?_page=${page}&_limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },
  
  getPostById: async (id: number): Promise<Post> => {
    const res = await fetch(`${BASE_URL}/posts/${id}`);
    if (!res.ok) throw new Error('Failed to fetch post');
    return res.json();
  },

  getPostsByUserId: async (userId: number): Promise<Post[]> => {
    const res = await fetch(`${BASE_URL}/users/${userId}/posts`);
    if (!res.ok) throw new Error('Failed to fetch user posts');
    return res.json();
  },

  createPost: async (post: Omit<Post, 'id'>): Promise<Post> => {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      body: JSON.stringify(post),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  },

  // Comments
  getCommentsByPostId: async (postId: number): Promise<Comment[]> => {
    const res = await fetch(`${BASE_URL}/posts/${postId}/comments`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },

  // Users
  getUserById: async (id: number): Promise<User> => {
    const res = await fetch(`${BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  }
};

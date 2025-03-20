// api.js - Service to handle API calls

const API_BASE_URL = 'http://localhost:3000';

// Function to handle API errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }
  return response.json();
};

// Get all users
export const getUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get all posts
export const getPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Get comments for a specific post
export const getComments = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};

// Get all data in a single batch to minimize API calls
export const getAllData = async () => {
  try {
    const [users, posts] = await Promise.all([
      getUsers(),
      getPosts(),
    ]);
    
    // For each post, fetch its comments
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        try {
          const comments = await getComments(post.id);
          return { ...post, comments };
        } catch (error) {
          console.warn(`Failed to fetch comments for post ${post.id}:`, error);
          return { ...post, comments: [] };
        }
      })
    );
    
    return {
      users,
      posts: postsWithComments,
    };
  } catch (error) {
    console.error('Error fetching all data:', error);
    throw error;
  }
};

export default {
  getUsers,
  getPosts,
  getComments,
  getAllData,
};
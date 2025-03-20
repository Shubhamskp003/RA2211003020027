import React, { useState, useEffect } from 'react';
import './Feed.css';

const Feed = ({ posts }) => {
  const [feedPosts, setFeedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  useEffect(() => {
    if (posts.length) {
      // Sort posts by creation date/id (assuming newer posts have higher ids)
      const sortedPosts = [...posts].sort((a, b) => b.id - a.id);
      
      // Add random images to posts
      const postsWithImages = sortedPosts.map(post => ({
        ...post,
        image: `https://picsum.photos/seed/${post.id}/600/400`
      }));
      
      setFeedPosts(postsWithImages);
      setLastUpdateTime(new Date());
      setIsLoading(false);
    }
  }, [posts]);

  // Function to handle new posts that might come in via API polling
  const handleNewPosts = () => {
    // In a real app, this would check for new posts
    // but for demo purposes, just update the timestamp
    setLastUpdateTime(new Date());
  };

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2>Recent Posts Feed</h2>
        <button className="refresh-button" onClick={handleNewPosts}>
          Refresh
        </button>
      </div>
      
      <p className="last-updated">
        Last updated: {lastUpdateTime.toLocaleTimeString()}
      </p>
      
      {isLoading ? (
        <div className="loading-indicator">Loading feed...</div>
      ) : (
        <div className="feed-posts">
          {feedPosts.map(post => (
            <div key={post.id} className="feed-post">
              <div className="post-header">
                <div className="post-meta">
                  <div className="post-author">User #{post.userId}</div>
                  <div className="post-time">
                    {new Date(Date.now() - Math.random() * 86400000).toLocaleString()}
                  </div>
                </div>
                <h3 className="post-title">{post.title}</h3>
              </div>
              
              <div className="post-image">
                <img src={post.image} alt={`Post ${post.id}`} />
              </div>
              
              <div className="post-content">
                <p>{post.body}</p>
              </div>
              
              <div className="post-footer">
                <div className="post-stats">
                  <span className="comment-count">
                    <i className="fa fa-comment"></i> {post.comments ? post.comments.length : 0} comments
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isLoading && feedPosts.length === 0 && (
        <div className="no-posts-message">
          No posts found in your feed. Check back later.
        </div>
      )}
    </div>
  );
};

export default Feed;
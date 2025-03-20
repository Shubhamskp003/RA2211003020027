import React, { useState, useEffect } from 'react';
import './TrendingPost.css';

const TrendingPosts = ({ posts }) => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (posts.length) {
      // Find posts with most comments
      // First, sort by comments count
      const sortedPosts = [...posts].sort((a, b) => {
        const commentsA = a.comments ? a.comments.length : 0;
        const commentsB = b.comments ? b.comments.length : 0;
        return commentsB - commentsA;
      });
      
      // Find the maximum comment count
      const maxComments = sortedPosts[0].comments ? sortedPosts[0].comments.length : 0;
      
      // Filter posts with the maximum number of comments
      const postsWithMaxComments = sortedPosts.filter(post => {
        const commentCount = post.comments ? post.comments.length : 0;
        return commentCount === maxComments;
      });
      
      // Add random images to posts
      const postsWithImages = postsWithMaxComments.map(post => ({
        ...post,
        image: `https://picsum.photos/seed/${post.id}/600/400`
      }));
      
      setTrendingPosts(postsWithImages);
      setIsLoading(false);
    }
  }, [posts]);

  return (
    <div className="trending-posts-container">
      <h2>Trending Posts</h2>
      <p className="page-description">Posts with the maximum number of comments</p>
      
      {isLoading ? (
        <div className="loading-indicator">Finding trending posts...</div>
      ) : (
        <div className="posts-grid">
          {trendingPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-image">
                <img src={post.image} alt={`Post ${post.id}`} />
              </div>
              <div className="post-content">
                <h3>{post.title}</h3>
                <p className="post-body">{post.body}</p>
                <div className="post-stats">
                  <span className="comment-count">
                    <i className="fa fa-comment"></i> {post.comments ? post.comments.length : 0} comments
                  </span>
                </div>
              </div>
              
              {post.comments && post.comments.length > 0 && (
                <div className="post-comments">
                  <h4>Top Comments</h4>
                  <ul>
                    {post.comments.slice(0, 3).map(comment => (
                      <li key={comment.id} className="comment">
                        <p className="comment-name">{comment.name}</p>
                        <p className="comment-body">{comment.body}</p>
                      </li>
                    ))}
                  </ul>
                  {post.comments.length > 3 && (
                    <p className="more-comments">
                      +{post.comments.length - 3} more comments
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {!isLoading && trendingPosts.length === 0 && (
        <div className="no-posts-message">
          No trending posts found. Try again later.
        </div>
      )}
    </div>
  );
};

export default TrendingPosts;
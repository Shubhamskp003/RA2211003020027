import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './TopUsers.css';

const TopUsers = ({ users, posts }) => {
  const [topUsers, setTopUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (users.length && posts.length) {
      // Count posts per user
      const userPostCounts = users.map(user => {
        const userPosts = posts.filter(post => post.userId === user.id);
        return {
          ...user,
          postCount: userPosts.length,
          // Random image for the user (as per requirements)
          avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`
        };
      });

      // Sort users by post count and take top 5
      const sortedUsers = [...userPostCounts].sort((a, b) => b.postCount - a.postCount).slice(0, 5);
      
      setTopUsers(sortedUsers);
      setIsLoading(false);
    }
  }, [users, posts]);

  // Data for chart
  const chartData = topUsers.map(user => ({
    name: user.name || user.username,
    posts: user.postCount
  }));

  return (
    <div className="top-users-container">
      <h2>Top Users</h2>
      <p className="page-description">The five users with the highest number of posts</p>
      
      {isLoading ? (
        <div className="loading-indicator">Calculating top users...</div>
      ) : (
        <>
          <div className="users-grid">
            {topUsers.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-avatar">
                  <img src={user.avatar} alt={user.name || user.username} />
                </div>
                <div className="user-info">
                  <h3>{user.name || user.username}</h3>
                  <p className="user-post-count">
                    <strong>{user.postCount}</strong> posts
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="chart-container">
            <h3>Posts Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="posts" fill="#4a90e2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default TopUsers;
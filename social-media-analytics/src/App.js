import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import TopUsers from './components/pages/TopUsers/TopUsers';
import TrendingPosts from './components/pages/TrendingPost/TrendingPost';


import Feed from './components/pages/Feed/Feed';


function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users and posts
        const [usersResponse, postsResponse] = await Promise.all([
          fetch('http://localhost:3000/users'),
          fetch('http://localhost:3000/posts')
        ]);

        // Check if responses are ok
        if (!usersResponse.ok || !postsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        // Parse JSON responses
        const usersData = await usersResponse.json();
        const postsData = await postsResponse.json();

        // Set state with fetched data
        setUsers(usersData);
        setPosts(postsData);
        setError(null);
      } catch (err) {
        setError('Error fetching data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchData, 10000); // Poll every 10 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="logo">
            <h1>AffordMed</h1>
            <p>Technology, Innovation & Affordability</p>
          </div>
          <nav className="main-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              Top Users
            </NavLink>
            <NavLink to="/trending" className={({ isActive }) => isActive ? "active" : ""}>
              Trending Posts
            </NavLink>
            <NavLink to="/feed" className={({ isActive }) => isActive ? "active" : ""}>
              Feed
            </NavLink>
          </nav>
        </header>

        <main className="content">
          {error && <div className="error-message">{error}</div>}
          {loading && !error && <div className="loading">Loading data...</div>}
          
          <Routes>
            <Route path="/" element={<TopUsers users={users} posts={posts} />} />
            <Route path="/trending" element={<TrendingPosts posts={posts} />} />
            <Route path="/feed" element={<Feed posts={posts} />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© 2025 AffordMed - Social Media Analytics Dashboard</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
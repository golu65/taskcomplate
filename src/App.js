import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import axios from 'axios';
import UserDirectory from './Components/UserDirectory';
import UserProfile from './Components/UserProfile';

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {

    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });


    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserDirectory users={users} />} />
        <Route path="/user/:userId" element={<UserProfile users={users} posts={posts} />} />
      </Routes>
    </Router>
  );
}

export default App;

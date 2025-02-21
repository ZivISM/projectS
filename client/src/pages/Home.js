import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Favorite, Comment, Share } from '@mui/icons-material';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch posts
  const fetchPosts = async () => {
    setFetchingPosts(true);
    try {
      console.log('Fetching posts with token:', localStorage.getItem('token'));
      
      const response = await fetch('http://localhost:5001/api/posts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      console.log('Fetched posts response:', data);
      
      if (!response.ok) throw new Error(data.message);
      
      // Ensure data is an array and sort by date
      const sortedPosts = Array.isArray(data) ? 
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : 
        [];
      
      setPosts(sortedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
      setPosts([]);
    } finally {
      setFetchingPosts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting post:', { content: newPost, author: user.id });
      
      const response = await fetch('http://localhost:5001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newPost,
          author: user.id
        }),
      });

      const data = await response.json();
      console.log('Post response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      setNewPost('');
      setSuccess('Post created successfully!');
      await fetchPosts(); // Wait for posts to refresh
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h5">Please login to view and create posts</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        {/* Post Creation */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Create Post
            </Typography>
            <form onSubmit={handlePostSubmit}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                sx={{ mb: 2 }}
                disabled={loading}
              />
              <Button 
                variant="contained" 
                type="submit"
                disabled={!newPost.trim() || loading}
              >
                Post
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        {fetchingPosts ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : posts.length > 0 ? (
          <Stack spacing={2}>
            {posts.map((post) => (
              <Card key={post._id} className="post-card">
                <CardContent>
                  <Typography variant="h6">
                    {post.author.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(post.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {post.content}
                  </Typography>
                  {post.mediaUrl && (
                    <CardMedia
                      component="img"
                      height="194"
                      image={post.mediaUrl}
                      alt="Post media"
                    />
                  )}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <IconButton>
                      <Favorite />
                    </IconButton>
                    <IconButton>
                      <Comment />
                    </IconButton>
                    <IconButton>
                      <Share />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No posts yet. Be the first to post something!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Notifications */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home; 
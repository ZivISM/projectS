const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Add this debug route at the top
router.get('/debug', auth, async (req, res) => {
  try {
    // Get all collections
    const collections = await mongoose.connection.db.collections();
    const results = {};
    
    // Get count of documents in each collection
    for (let collection of collections) {
      const count = await collection.countDocuments();
      results[collection.collectionName] = count;
    }

    // Get sample posts
    const posts = await Post.find()
      .populate('author', 'username')
      .limit(5)
      .lean();

    res.json({
      collections: results,
      samplePosts: posts,
      userInfo: req.user
    });
  } catch (err) {
    console.error('Debug route error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .exec();
    
    console.log('Fetched posts:', posts);
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Create a post
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    console.log('Creating post with:', {
      content,
      userId: req.user.id,
      fullRequest: req.body
    });
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = new Post({
      content,
      author: req.user.id,
      createdAt: new Date()
    });

    await post.save();
    console.log('New post saved:', post.toObject());

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username')
      .lean();
    
    console.log('Populated post:', populatedPost);

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Error creating post' });
  }
});

module.exports = router; 
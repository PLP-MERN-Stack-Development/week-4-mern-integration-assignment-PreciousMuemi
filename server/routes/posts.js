// posts.js - Routes for blog post operations

const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validatePost = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  body('category')
    .isMongoId()
    .withMessage('Please provide a valid category ID'),
];

// @route   GET /api/posts
// @desc    Get all posts with pagination and filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = { isPublished: true };
    
    // Add category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Add search filter
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    
    const posts = await Post.find(filter)
      .populate('author', 'firstName lastName username')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Post.countDocuments(filter);
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'firstName lastName username')
      .populate('category', 'name slug')
      .populate('comments.user', 'firstName lastName username');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }
    
    // Increment view count
    await post.incrementViewCount();
    
    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, validatePost, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    // Check if category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category not found',
      });
    }
    
    const post = new Post({
      ...req.body,
      author: req.user.id,
    });
    
    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'firstName lastName username')
      .populate('category', 'name slug');
    
    res.status(201).json({
      success: true,
      data: populatedPost,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A post with this title already exists',
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, validatePost, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    let post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }
    
    // Check if user owns the post or is admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this post',
      });
    }
    
    // Check if category exists
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          error: 'Category not found',
        });
      }
    }
    
    post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'firstName lastName username')
     .populate('category', 'name slug');
    
    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }
    
    // Check if user owns the post or is admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this post',
      });
    }
    
    await post.deleteOne();
    
    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comments', auth, [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }
    
    await post.addComment(req.user.id, req.body.content);
    
    const updatedPost = await Post.findById(req.params.id)
      .populate('author', 'firstName lastName username')
      .populate('category', 'name slug')
      .populate('comments.user', 'firstName lastName username');
    
    res.json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

module.exports = router; 
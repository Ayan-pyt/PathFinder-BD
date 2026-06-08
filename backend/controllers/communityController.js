const CommunityPost = require('../models/CommunityPost');

const getPosts = async (req, res) => {
  try {
    const { category, country } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (country) query.country = country;

    const posts = await CommunityPost.find(query)
      .populate('author', 'name avatar')
      .populate('comments.author', 'name avatar')
      .populate('country', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, category, country } = req.body;
    const post = await CommunityPost.create({
      author: req.user._id,
      title, content, category, country
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleUpvote = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const index = post.upvotes.indexOf(req.user._id);
    if (index === -1) post.upvotes.push(req.user._id);
    else post.upvotes.splice(index, 1);

    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.comments.push({
      author: req.user._id,
      content: req.body.content
    });

    await post.save();
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPosts, createPost, toggleUpvote, addComment };

const NewsPost = require('../models/NewsPost');

const getNews = async (req, res) => {
  try {
    const news = await NewsPost.find({ isPublished: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createNews = async (req, res) => {
  try {
    const { title, content, imageUrl, link } = req.body;
    const news = await NewsPost.create({
      title, content, imageUrl, link, author: req.user._id
    });
    res.status(201).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    const news = await NewsPost.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'News post not found' });
    res.json({ success: true, message: 'News post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getNews, createNews, deleteNews };

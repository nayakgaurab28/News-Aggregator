const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect } = require('../middleware/authMiddleware');

// Private routes - protected by JWT
router.post('/', protect, articleController.submitArticle);
router.get('/', articleController.getArticlesWithPagination);

module.exports = router;

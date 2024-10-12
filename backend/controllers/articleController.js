const Article = require('../models/Article');

// Submit a new article
exports.submitArticle = async (req, res) => {
    const { title, category, summary, link } = req.body;

    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    
    try {
        const newArticle = new Article({
            title,
            category,
            summary,
            link,
            submittedBy: req.user.name, // User's name from the JWT
        });

        await newArticle.save();
        res.status(201).json(newArticle);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get paginated articles
exports.getArticlesWithPagination = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    try {
        const articles = await Article.find()
            .limit(limit)
            .skip((page - 1) * limit);
        res.json(articles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

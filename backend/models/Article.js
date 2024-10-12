const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    link: { type: String, required: true },
    submittedBy: { type: String, required: true },
}, {
    timestamps: true
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;

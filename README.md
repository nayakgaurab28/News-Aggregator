# News Aggregator

This is a crowdsourced News Aggregator web application where users can submit articles, upvote or downvote them, add comments, and view paginated lists of articles. The project features secure authentication using JWT and includes several middleware functions for authentication and token management.

## Features

- **User Authentication**: Login and Signup using JWT.
- **Article Submission**: Users can submit articles including title, category, summary, and link.
- **Upvote & Downvote**: Articles can be upvoted or downvoted by authenticated users.
- **Commenting**: Users can comment on articles.
- **Pagination**: View articles with pagination.
- **JWT Protected Routes**: Ensures only authenticated users can access certain features.

## Project Structure

```bash
NewsAggregator
├── backend
│   ├── controllers
│   │   ├── articleController.js  # Handles article logic (CRUD operations)
│   │   └── userController.js     # Handles user authentication logic
│   ├── middleware
│   │   └── authMiddleware.js     # JWT authentication middleware
│   ├── models
│   │   ├── Article.js            # Article model schema
│   │   └── User.js               # User model schema
│   ├── routes
│   │   ├── articleRoutes.js      # Article routes (submit, upvote, comment)
│   │   └── authRoutes.js         # Authentication routes (login, signup)
│   ├── utils
│   │   └── generateToken.js      # Utility to generate JWT tokens
│   └── app.js                    # Express application setup
└── frontend
    ├── index.html                # Homepage with list of articles
    ├── login.html                # Login page
    ├── signup.html               # Signup page
    ├── article.html              # Article submission page
    ├── news-detail.html          # Detailed view of a news article
    ├── profile.html              # User profile page
    └── submit.html               # Submit article page

document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articles-container');

    // Function to fetch and display articles on the home page
    const loadArticles = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/articles');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const articles = await response.json();

            articlesContainer.innerHTML = '';

            if (articles.length === 0) {
                articlesContainer.innerHTML = '<p>No articles available.</p>';
                return;
            }

            articles.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.classList.add('article');

                articleElement.innerHTML = `
                    <h3><a href="news-details.html?id=${article._id}" class="news-title">${article.title}</a></h3>
                    <p>Published on: ${article.publishedOn}</p>
                    <p>Submitted by: ${article.submittedBy}</p>
                    <p>${article.description.substring(0, 150)}... <a href="news-details.html?id=${article._id}">Read more</a></p>
                `;

                articlesContainer.appendChild(articleElement);
            });
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    // Load articles on page load
    loadArticles();

    const submitButton = document.getElementById('submit-btn');
    if (submitButton) {
        submitButton.addEventListener('click', async () => {
            const token = localStorage.getItem('token'); // Get the token from localStorage

            // Check if the user is logged in (token exists)
            if (!token) {
                alert('You must be logged in to submit an article.');
                window.location.href = 'login.html'; // Redirect to login page
                return;
            }

            const title = document.getElementById('article-title').value;
            const category = document.getElementById('article-category').value;
            const summary = document.getElementById('article-summary').value;
            const link = document.getElementById('article-link').value;

            if (!title || !category || !summary || !link) {
                alert('Please fill in all fields before submitting.');
                return;
            }

            const articleData = {
                title,
                category,
                summary,
                description: summary,
                link,
                upvotes: 0,
                downvotes: 0,
                comments: [],
                publishedOn: new Date().toISOString().split('T')[0],
                submittedBy: 'Anonymous' // Replace with actual user info if available
            };

            try {
                const response = await fetch('http://localhost:5000/api/articles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Send the token for authentication
                    },
                    body: JSON.stringify(articleData)
                });

                if (response.ok) {
                    alert('News article submitted successfully!');
                    document.getElementById('submission-form').reset();
                } else {
                    const errorMsg = await response.text();
                    alert('Failed to submit article: ' + errorMsg);
                }
            } catch (error) {
                console.error('Error submitting article:', error);
                alert('Failed to submit article.');
            }
        });
    }

    // Handle user signup
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            try {
                const response = await fetch('http://localhost:5000/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                if (response.ok) {
                    alert('Signup successful! You can now log in.');
                    window.location.href = 'login.html'; // Redirect to login page
                } else {
                    const errorMsg = await response.text();
                    alert('Signup failed: ' + errorMsg);
                }
            } catch (error) {
                console.error('Error signing up:', error);
                alert('An error occurred during signup.');
            }
        });
    }

    // Simulate user login status
    function checkLoginStatus() {
        return localStorage.getItem('token') !== null;
    }

    // Handle navigation based on login status
    function updateNav() {
        const profileLink = document.getElementById('profile-link');
        const loginLink = document.querySelector('a[href="login.html"]');
        const logoutLink = document.getElementById('logout-link');
        
        if (checkLoginStatus()) {
            profileLink.style.display = 'inline-block';
            loginLink.style.display = 'none';
            logoutLink.style.display = 'inline-block';
        } else {
            profileLink.style.display = 'none';
            loginLink.style.display = 'inline-block';
            logoutLink.style.display = 'none';
        }
    }

    // Handle user login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    handleLoginSuccess(data.token); // Use handleLoginSuccess on successful login
                } else {
                    const errorMsg = await response.text();
                    alert('Login failed: ' + errorMsg);
                }
            } catch (error) {
                console.error('Error logging in:', error);
            }
        });
    }

    // On successful login
    function handleLoginSuccess(token) {
        localStorage.setItem('token', token);
        window.location.href = 'index.html'; // Redirect to homepage after login
    }

    // On logout
    function handleLogout() {
        localStorage.removeItem('token');  // Remove the JWT token
        localStorage.removeItem('user');   // Remove user info
        window.location.href = 'login.html';  // Redirect to login page after logout
    }

    // Handle logout
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', () => {
            handleLogout(); // Call handleLogout on clicking the logout link
        });
    }

    // Check login status and update nav on page load
    updateNav();

    // For the profile page, redirect if not logged in
    function checkProfileAccess() {
        if (!checkLoginStatus()) {
            alert('You need to log in to view this page.');
            window.location.href = 'login.html';
        }
    }

    // Call the function on page load for the profile page
    if (window.location.pathname.includes('profile.html')) {
        checkProfileAccess();
    }

    // Call the function on page load for news-details.html
    function loadNewsDetails() {
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('id');
        const articles = JSON.parse(localStorage.getItem('newsArticles')) || [];
        const article = articles.find(a => a._id === articleId);

        if (article) {
            document.getElementById('news-title').innerText = article.title;
            document.getElementById('news-description').innerText = article.description;
            document.getElementById('news-published-on').innerText = `Published on: ${article.publishedOn}`;
            document.getElementById('news-submitted-by').innerText = `Submitted by: ${article.submittedBy}`;
            document.getElementById('news-upvotes').innerText = `Upvotes: ${article.upvotes}`;
            document.getElementById('news-downvotes').innerText = `Downvotes: ${article.downvotes}`;
            
            const newsLink = document.getElementById('news-link');
            newsLink.href = article.link;
            newsLink.innerText = 'Read More';

            // Load comments
            const commentsList = document.getElementById('comments-list');
            commentsList.innerHTML = ''; // Clear existing comments
            article.comments.forEach(comment => {
                const commentItem = document.createElement('li');
                commentItem.innerText = `${comment.user}: ${comment.comment}`;
                commentsList.appendChild(commentItem);
            });
        } else {
            document.getElementById('news-details').innerHTML = '<p>News article not found.</p>';
        }
    }

    if (window.location.pathname.includes('news-details.html')) {
        loadNewsDetails();
    }
});

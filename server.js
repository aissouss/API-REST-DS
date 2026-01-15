const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// In-memory data store
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

let posts = [
    { id: 1, title: 'First Post', content: 'Hello World', userId: 1 },
    { id: 2, title: 'Second Post', content: 'REST API Example', userId: 2 }
];

// ===== USERS ENDPOINTS =====

// GET all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// GET single user by ID
app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
   
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// POST create new user
app.post('/api/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };
   
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
   
    if (index !== -1) {
        users[index] = { ...users[index], ...req.body };
        res.json(users[index]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);    
    if (index !== -1) {
        const deletedUser = users.splice(index, 1)[0];
        res.json({ message: 'User deleted', user: deletedUser });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// ===== POSTS ENDPOINTS =====

// GET all posts
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// GET posts by user ID
app.get('/api/users/:userId/posts', (req, res) => {
    const userId = parseInt(req.params.userId);
    const userPosts = posts.filter(p => p.userId === userId);
    res.json(userPosts);
});

// POST create new post
app.post('/api/posts', (req, res) => {
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        userId: req.body.userId
    };
   
    posts.push(newPost);
    res.status(201).json(newPost);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET    /api/users');
    console.log('  GET    /api/users/:id');
    console.log('  POST   /api/users');
    console.log('  PUT    /api/users/:id');
    console.log('  DELETE /api/users/:id');
    console.log('  GET    /api/posts');
    console.log('  GET    /api/users/:userId/posts');
    console.log('  POST   /api/posts');
    console.log('  GET    /api/health');
});
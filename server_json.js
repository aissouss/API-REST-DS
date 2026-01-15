const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// =====================
// MIDDLEWARES
// =====================
app.use(cors());
app.use(express.json());

// =====================
// FILE PATHS
// =====================
const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');
const postsFile = path.join(dataDir, 'posts.json');

// =====================
// UTILITY FUNCTIONS
// =====================
function ensureFileExists(filePath) {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
}

function readData(filePath) {
    ensureFileExists(filePath);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function saveData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// =====================
// LOAD DATA (PERSISTENT)
// =====================
let users = readData(usersFile);
let posts = readData(postsFile);

// =====================
// USERS ENDPOINTS
// =====================

// GET all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// GET user by ID
app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
});

// CREATE user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name,
        email
    };

    users.push(newUser);
    saveData(usersFile, users);

    res.status(201).json(newUser);
});

// UPDATE user
app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex] = { ...users[userIndex], ...req.body };
    saveData(usersFile, users);

    res.json(users[userIndex]);
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    posts = posts.filter(p => p.userId !== id);

    saveData(usersFile, users);
    saveData(postsFile, posts);

    res.json({ message: 'User deleted', user: deletedUser });
});

// =====================
// POSTS ENDPOINTS
// =====================

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

// CREATE post
app.post('/api/posts', (req, res) => {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
        return res.status(400).json({ error: 'Title, content and userId are required' });
    }

    const userExists = users.some(u => u.id === userId);
    if (!userExists) {
        return res.status(400).json({ error: 'User does not exist' });
    }

    const newPost = {
        id: posts.length ? posts[posts.length - 1].id + 1 : 1,
        title,
        content,
        userId
    };

    posts.push(newPost);
    saveData(postsFile, posts);

    res.status(201).json(newPost);
});

// =====================
// HEALTH CHECK
// =====================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// =====================
// ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

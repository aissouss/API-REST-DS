const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

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
const usersFile = path.join(dataDir, 'users.xml');
const postsFile = path.join(dataDir, 'posts.xml');

// =====================
// XML UTILS
// =====================
function ensureXMLFile(filePath, rootTag) {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, `<${rootTag}></${rootTag}>`);
    }
}

function readXML(filePath, rootTag, childTag) {
    ensureXMLFile(filePath, rootTag);

    const xml = fs.readFileSync(filePath, 'utf-8');
    let result = [];

    xml2js.parseString(xml, { explicitArray: false }, (err, data) => {
        if (err) throw err;
        if (data[rootTag] && data[rootTag][childTag]) {
            result = Array.isArray(data[rootTag][childTag])
                ? data[rootTag][childTag]
                : [data[rootTag][childTag]];
        }
    });

    return result;
}

function writeXML(filePath, rootTag, childTag, data) {
    const builder = new xml2js.Builder();
    const xml = builder.buildObject({
        [rootTag]: {
            [childTag]: data
        }
    });

    fs.writeFileSync(filePath, xml);
}

// =====================
// LOAD DATA
// =====================
let users = readXML(usersFile, 'users', 'user');
let posts = readXML(postsFile, 'posts', 'post');

// =====================
// USERS ROUTES
// =====================

// GET all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// GET user by ID
app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(u => u.id == id);

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
        id: users.length ? Number(users[users.length - 1].id) + 1 : 1,
        name,
        email
    };

    users.push(newUser);
    writeXML(usersFile, 'users', 'user', users);

    res.status(201).json(newUser);
});

// UPDATE user
app.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const index = users.findIndex(u => u.id == id);

    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users[index] = { ...users[index], ...req.body };
    writeXML(usersFile, 'users', 'user', users);

    res.json(users[index]);
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const index = users.findIndex(u => u.id == id);

    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const deletedUser = users.splice(index, 1)[0];
    posts = posts.filter(p => p.userId != id);

    writeXML(usersFile, 'users', 'user', users);
    writeXML(postsFile, 'posts', 'post', posts);

    res.json({ message: 'User deleted', user: deletedUser });
});

// =====================
// POSTS ROUTES
// =====================

// GET all posts
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// GET posts by user
app.get('/api/users/:userId/posts', (req, res) => {
    const userId = req.params.userId;
    const userPosts = posts.filter(p => p.userId == userId);
    res.json(userPosts);
});

// CREATE post
app.post('/api/posts', (req, res) => {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const userExists = users.some(u => u.id == userId);
    if (!userExists) {
        return res.status(400).json({ error: 'User does not exist' });
    }

    const newPost = {
        id: posts.length ? Number(posts[posts.length - 1].id) + 1 : 1,
        title,
        content,
        userId
    };

    posts.push(newPost);
    writeXML(postsFile, 'posts', 'post', posts);

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
    console.log(`Server running at http://localhost:${PORT}`);
});

const fs = require('fs');
const { join } = require('path');

const compression = require('compression');
const express = require('express');
const spdy = require('spdy');

const serverPush = require('./middleware/server-push');

const app = express();

app.use(compression());

app.get('/', serverPush('index'), (req, res) => {
    res.sendFile(join(__dirname, 'pages/index.html'));
});

app.get('/api/messages', (_, res) => {
    res.json(require('./fixtures/messages'));
});

app.get('/api/users', (_, res) => {
    res.json(require('./fixtures/users'));
});

app.get('/api/emoji', (_, res) => {
    res.json(require('./fixtures/emoji'));
});

app.use(express.static('client/dist'));

spdy.createServer({
    key: fs.readFileSync(join(__dirname, 'certs/server.key')),
    cert: fs.readFileSync(join(__dirname, 'certs/server.crt')),
}, app).listen(8080);

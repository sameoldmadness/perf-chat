const fs = require('fs');
const { join } = require('path');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
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

app.listen(8080);

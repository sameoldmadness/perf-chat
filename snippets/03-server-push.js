const serverPush = require('./middleware/server-push');

app.get('/', serverPush('index'), (req, res) => {
    res.sendFile(join(__dirname, 'pages/index.html'));
});

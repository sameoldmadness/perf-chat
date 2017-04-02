const spdy = require('spdy');
spdy.createServer({
    key: fs.readFileSync(join(__dirname, 'certs/server.key')),
    cert: fs.readFileSync(join(__dirname, 'certs/server.crt')),
}, app).listen(8080);

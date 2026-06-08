const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/dados') {
    const dados = JSON.parse(fs.readFileSync('dados.json', 'utf-8'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dados));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Olá, Node.js!</h1><p>Servidor HTTP básico funcionando.</p><a href="/dados">Ver dados</a>');
  }
});

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

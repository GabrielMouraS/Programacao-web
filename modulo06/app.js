const { somar, multiplicar } = require('./utils');
const fs = require('fs');
const http = require('http');

const resultadoSoma = somar(10, 5);
const resultadoMultiplicacao = multiplicar(10, 5);

const textoParaSalvar = `Soma: ${resultadoSoma}\nMultiplicação: ${resultadoMultiplicacao}`;
fs.writeFileSync('resultado.txt', textoParaSalvar);

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>Node JS</title></head>
        <body>
            <h1>Servidor Rodando</h1>
            <p>Os resultados salvos no arquivo resultado.txt</p>
        </body>
        </html>
    `);
});

server.listen(3000);
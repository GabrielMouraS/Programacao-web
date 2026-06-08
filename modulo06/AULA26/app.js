const { somar, saudacao, calcularMedia } = require('./utils');
const fs = require('fs');

const resultado1 = somar(10, 5);
const resultado2 = saudacao('FATEC');
const resultado3 = calcularMedia([8, 9, 7, 6]);

console.log(resultado1);
console.log(resultado2);
console.log(`Média: ${resultado3}`);

const conteudo = `Resultados:\n${resultado1}\n${resultado2}\nMédia: ${resultado3}`;
fs.writeFileSync('saida.txt', conteudo, 'utf-8');
console.log('Arquivo saida.txt gerado com sucesso!');

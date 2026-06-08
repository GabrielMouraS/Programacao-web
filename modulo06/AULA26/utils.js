function somar(a, b) {
  return a + b;
}

function saudacao(nome) {
  return `Olá, ${nome}!`;
}

function calcularMedia(notas) {
  const soma = notas.reduce((acc, n) => acc + n, 0);
  return soma / notas.length;
}

module.exports = { somar, saudacao, calcularMedia };

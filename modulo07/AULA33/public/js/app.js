const API = '/api';
let token = localStorage.getItem('token');
let categoriaFiltro = '';

const listaProdutos = document.getElementById('listaProdutos');
const secaoForm = document.getElementById('secaoFormProduto');
const formLogin = document.getElementById('formLogin');
const usuarioLogado = document.getElementById('usuarioLogado');
const nomeUsuario = document.getElementById('nomeUsuario');

function atualizarUI() {
  if (token) {
    formLogin.hidden = true;
    usuarioLogado.hidden = false;
    secaoForm.hidden = false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    nomeUsuario.textContent = `Bem-vindo!`;
  } else {
    formLogin.hidden = false;
    usuarioLogado.hidden = true;
    secaoForm.hidden = true;
  }
  carregarProdutos();
}

async function carregarProdutos() {
  const url = categoriaFiltro ? `${API}/produtos?categoria=${categoriaFiltro}` : `${API}/produtos`;
  try {
    const res = await fetch(url);
    const dados = await res.json();
    const produtos = dados.produtos || [];
    if (!produtos.length) {
      listaProdutos.innerHTML = '<p class="mensagem">Nenhum produto encontrado.</p>';
      return;
    }
    listaProdutos.innerHTML = produtos.map(p => `
      <div class="card-produto">
        <h3>${p.nome}</h3>
        <p class="preco">R$ ${p.preco.toFixed(2)}</p>
        <p class="cat">${p.categoria}</p>
        ${token ? `<button class="btn-del" data-id="${p._id}">Excluir</button>` : ''}
      </div>
    `).join('');
  } catch {
    listaProdutos.innerHTML = '<p class="mensagem">Erro ao carregar produtos.</p>';
  }
}

listaProdutos.addEventListener('click', async (e) => {
  if (!e.target.classList.contains('btn-del')) return;
  const id = e.target.dataset.id;
  await fetch(`${API}/produtos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  carregarProdutos();
});

document.getElementById('btnLogin').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  const dados = await res.json();
  if (res.ok) {
    token = dados.token;
    localStorage.setItem('token', token);
    atualizarUI();
  } else {
    alert(dados.erro || 'Erro ao fazer login');
  }
});

document.getElementById('btnRegistrar').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const res = await fetch(`${API}/auth/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: email.split('@')[0], email, senha }),
  });
  const dados = await res.json();
  if (res.ok) {
    token = dados.token;
    localStorage.setItem('token', token);
    atualizarUI();
  } else {
    alert(dados.erro || 'Erro ao registrar');
  }
});

document.getElementById('btnLogout').addEventListener('click', () => {
  token = null;
  localStorage.removeItem('token');
  atualizarUI();
});

document.getElementById('formProduto').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nomeProduto').value;
  const preco = parseFloat(document.getElementById('precoProduto').value);
  const categoria = document.getElementById('categoriaProduto').value;
  await fetch(`${API}/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ nome, preco, categoria }),
  });
  e.target.reset();
  carregarProdutos();
});

document.getElementById('btnFiltrar').addEventListener('click', () => {
  categoriaFiltro = document.getElementById('filtroCat').value;
  carregarProdutos();
});

atualizarUI();

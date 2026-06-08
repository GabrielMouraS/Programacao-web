# API de Produtos - Documentação

API RESTful construída com Node.js, Express e MongoDB.

## Base URL

```
http://localhost:3000/api
```

## Autenticação

A API usa JWT (JSON Web Token). Para rotas protegidas, envie o token no header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### Auth

#### POST /auth/registrar
Cria um novo usuário.

**Body:**
```json
{
  "nome": "Gabriel",
  "email": "gabriel@email.com",
  "senha": "123456"
}
```

**Resposta 201:**
```json
{
  "token": "eyJhbGci...",
  "usuario": { "id": "...", "nome": "Gabriel", "email": "gabriel@email.com" }
}
```

---

#### POST /auth/login
Autentica um usuário existente.

**Body:**
```json
{
  "email": "gabriel@email.com",
  "senha": "123456"
}
```

**Resposta 200:**
```json
{
  "token": "eyJhbGci...",
  "usuario": { "id": "...", "nome": "Gabriel", "email": "gabriel@email.com" }
}
```

---

### Produtos

#### GET /produtos
Lista todos os produtos. Suporta filtros via query string.

**Query params:**
- `categoria` — filtra por categoria
- `ativo` — true ou false
- `ordenar` — campo para ordenação (padrão: nome)
- `pagina` — número da página (padrão: 1)
- `limite` — itens por página (padrão: 10)

**Resposta 200:**
```json
{
  "total": 25,
  "pagina": 1,
  "produtos": [...]
}
```

---

#### GET /produtos/:id
Busca um produto pelo ID.

**Resposta 200:**
```json
{
  "_id": "...",
  "nome": "Notebook",
  "preco": 4500,
  "categoria": "Eletrônicos",
  "estoque": 5,
  "ativo": true
}
```

**Resposta 404:**
```json
{ "erro": "Produto não encontrado" }
```

---

#### POST /produtos — Protegida
Cria um novo produto.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "nome": "Notebook",
  "preco": 4500,
  "categoria": "Eletrônicos",
  "estoque": 5
}
```

**Resposta 201:** produto criado.

---

#### PUT /produtos/:id — Protegida
Atualiza um produto existente.

**Headers:** `Authorization: Bearer <token>`

**Body:** campos a atualizar.

**Resposta 200:** produto atualizado.

---

#### DELETE /produtos/:id — Protegida
Remove um produto.

**Headers:** `Authorization: Bearer <token>`

**Resposta 204:** sem conteúdo.

---

## Códigos de Status

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Criado |
| 204 | Sem conteúdo |
| 400 | Dados inválidos |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 409 | Conflito (duplicado) |
| 500 | Erro interno |

---

## Como executar

```bash
npm install
cp .env.example .env
# preencher MONGODB_URI e JWT_SECRET no .env
npm run dev
```

let tarefas = [];
let proximoId = 1;

function listar(req, res) {
  res.json(tarefas);
}

function criar(req, res) {
  const { titulo, descricao } = req.body;
  if (!titulo) {
    return res.status(400).json({ erro: 'Título é obrigatório' });
  }
  const tarefa = { id: proximoId++, titulo, descricao: descricao || '', concluida: false };
  tarefas.push(tarefa);
  res.status(201).json(tarefa);
}

function atualizar(req, res) {
  const id = parseInt(req.params.id);
  const index = tarefas.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
  tarefas[index] = { ...tarefas[index], ...req.body };
  res.json(tarefas[index]);
}

function remover(req, res) {
  const id = parseInt(req.params.id);
  const index = tarefas.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
  tarefas.splice(index, 1);
  res.status(204).send();
}

module.exports = { listar, criar, atualizar, remover };

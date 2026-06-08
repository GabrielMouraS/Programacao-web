const Produto = require('../models/Produto');

async function listar(req, res, next) {
  try {
    const { categoria, ativo, ordenar = 'nome', pagina = 1, limite = 10 } = req.query;
    const filtro = {};
    if (categoria) filtro.categoria = categoria;
    if (ativo !== undefined) filtro.ativo = ativo === 'true';
    const skip = (parseInt(pagina) - 1) * parseInt(limite);
    const total = await Produto.countDocuments(filtro);
    const produtos = await Produto.find(filtro).sort(ordenar).skip(skip).limit(parseInt(limite));
    res.json({ total, pagina: parseInt(pagina), produtos });
  } catch (err) {
    next(err);
  }
}

async function buscar(req, res, next) {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(produto);
  } catch (err) {
    next(err);
  }
}

async function criar(req, res, next) {
  try {
    const produto = new Produto({ ...req.body, criadoPor: req.usuarioId });
    await produto.save();
    res.status(201).json(produto);
  } catch (err) {
    next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(produto);
  } catch (err) {
    next(err);
  }
}

async function remover(req, res, next) {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, buscar, criar, atualizar, remover };

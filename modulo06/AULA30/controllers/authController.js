const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

async function registrar(req, res) {
  try {
    const { nome, email, senha } = req.body;
    const usuario = new Usuario({ nome, email, senha });
    await usuario.save();
    const token = jwt.sign({ id: usuario._id, role: usuario.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, usuario: { id: usuario._id, nome, email, role: usuario.role } });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario || !(await usuario.compararSenha(senha))) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ id: usuario._id, role: usuario.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, usuario: { id: usuario._id, nome: usuario.nome, email, role: usuario.role } });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function perfil(req, res) {
  try {
    const usuario = await Usuario.findById(req.usuarioId).select('-senha');
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = { registrar, login, perfil };

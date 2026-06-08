function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ erro: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ erro: 'ID inválido' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ erro: 'Registro duplicado' });
  }
  res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = errorHandler;

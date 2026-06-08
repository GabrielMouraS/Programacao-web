const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }
  try {
    const payload = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    req.usuarioId = payload.id;
    req.usuarioRole = payload.role;
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido' });
  }
}

module.exports = { autenticar };

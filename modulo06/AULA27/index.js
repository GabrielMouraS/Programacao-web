const express = require('express');
const tarefaRoutes = require('./routes/tarefaRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'API de Tarefas - Aula 27' });
});

app.use('/tarefas', tarefaRoutes);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});

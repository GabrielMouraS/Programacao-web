require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const alunoRoutes = require('./routes/alunoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar:', err));

app.use('/alunos', alunoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});

const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  nome: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  idade: { type: Number, min: 16, max: 80 },
  curso: { type: String, required: true },
  notas: [Number],
  ativo: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Aluno', alunoSchema);

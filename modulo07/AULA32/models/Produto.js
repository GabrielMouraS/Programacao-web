const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  preco: { type: Number, required: true, min: 0 },
  categoria: {
    type: String,
    required: true,
    enum: ['Eletrônicos', 'Móveis', 'Roupas', 'Alimentos', 'Outros'],
  },
  estoque: { type: Number, default: 0, min: 0 },
  ativo: { type: Boolean, default: true },
  criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
}, { timestamps: true });

module.exports = mongoose.model('Produto', produtoSchema);

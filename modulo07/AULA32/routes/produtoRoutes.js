const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/produtoController');
const { autenticar } = require('../middleware/auth');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscar);
router.post('/', autenticar, ctrl.criar);
router.put('/:id', autenticar, ctrl.atualizar);
router.delete('/:id', autenticar, ctrl.remover);

module.exports = router;

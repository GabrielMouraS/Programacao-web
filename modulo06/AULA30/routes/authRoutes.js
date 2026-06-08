const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const { autenticar } = require('../middleware/auth');

router.post('/registrar', ctrl.registrar);
router.post('/login', ctrl.login);
router.get('/perfil', autenticar, ctrl.perfil);

module.exports = router;

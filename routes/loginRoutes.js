const LoginController = require("../controllers/LoginController");
const express = require("express");
const router = express.Router();
const checarSessao = require('../helpers/auth').checarSessao;


router.post('/enter', LoginController.login);
router.get('/logout', checarSessao, LoginController.logout);

module.exports = router;
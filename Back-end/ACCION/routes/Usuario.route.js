const express = require("express");
const UsuarioController = require("../controllers/Usuario.controller");
const TokenAutenticacion = require("../middlewares/autorizacion.middleware");
const autorizarRoles = require("../middlewares/role.middleware");

const router = express.Router();

router.post("/Registrar", UsuarioController.Registro);
router.post("/IniciarSesion", UsuarioController.IniciarSesion);
router.get("/usuarios", TokenAutenticacion, autorizarRoles([1]), UsuarioController.getTodosUsuarios);
router.get("/usuarios/:id", TokenAutenticacion, autorizarRoles([1, 2, 3]), UsuarioController.getUsuarioPorId);
router.post("/Registrar/admin", TokenAutenticacion, autorizarRoles([1]), UsuarioController.RegistroPorAdmin);

module.exports = router;
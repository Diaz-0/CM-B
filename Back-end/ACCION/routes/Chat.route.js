const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/Chat.controller");
const TokenAutenticacion = require("../middlewares/autorizacion.middleware");
const autorizarRoles = require("../middlewares/role.middleware");

router.post("/Iniciar", TokenAutenticacion, ChatController.EnviarMensaje);
router.get("/:id_consulta", TokenAutenticacion, ChatController.getHistorialChat);
router.get("/usuario/:id", TokenAutenticacion, autorizarRoles([1, 2, 3]), ChatController.getChatsActivos);
module.exports = router;

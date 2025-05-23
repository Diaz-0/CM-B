const express = require("express");
const router = express.Router();
const ConsultaController = require("../controllers/Consulta.controller");
const TokenAutenticacion = require("../middlewares/autorizacion.middleware");
const autorizarRoles = require("../middlewares/role.middleware");

router.post("/crear", TokenAutenticacion, autorizarRoles([3]), ConsultaController.CrearConsulta);
router.patch("/:id", TokenAutenticacion, autorizarRoles([1, 2]), ConsultaController.updateEstado);
router.get("/paciente", TokenAutenticacion, autorizarRoles([1, 3]), ConsultaController.getConsultasPorPaciente);
router.get("/doctor", TokenAutenticacion, autorizarRoles([1, 2]), ConsultaController.getConsultasPorDoctor);

module.exports = router;

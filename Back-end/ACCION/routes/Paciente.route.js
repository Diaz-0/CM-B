const express = require("express");
const PacienteController = require("../controllers/Paciente.controller");
const TokenAutenticacion = require("../middlewares/autorizacion.middleware");
const autorizarRoles = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/Pacientes", PacienteController.getTodosPacientes);
router.get("/:id", PacienteController.getPacientePorId);

router.patch("/:id", TokenAutenticacion, autorizarRoles([1,3]), PacienteController.updatePaciente);
router.delete("/:id", TokenAutenticacion, autorizarRoles([1]), PacienteController.deletePaciente);


module.exports = router;

const express = require("express");
const DoctorController = require("../controllers/Doctor.controller");
const TokenAutenticacion = require("../middlewares/autorizacion.middleware");
const autorizarRoles = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/Doctores", DoctorController.getTodosDoctors);
router.get("/:id", DoctorController.getDoctorPorId);

router.patch("/:id", TokenAutenticacion, autorizarRoles([1,2]), DoctorController.updateDoctor);
router.delete("/:id", TokenAutenticacion, autorizarRoles([1]), DoctorController.deleteDoctor);

module.exports = router;

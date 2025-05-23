const ConsultaSchema = {
  id_paciente: {
    type: Number,
    required: true,
  },
  id_doctor: {
    type: Number,
    required: true,
  },
  fecha_cita: {
    type: Date,
    required: true,
  },
  estado: {
    type: String,
    enum: ["pendiente", "confirmada", "completada", "cancelada"],
    default: "pendiente",
  },
  motivo: {
    type: String,
    required: false,
  },
  creado_en: {
    type: Date,
    default: Date.now,
  },
  actualizado_en: {
    type: Date,
    default: Date.now,
  },
};

module.exports = ConsultaSchema;

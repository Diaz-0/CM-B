const PacienteSchema = {
  id_usuario: {
    type: String,
    required: true,
  },
  curp: {
    type: String,
    required: true,
  },
  historial_medico: {
    type: String,
    required: false,
  },
  direccion: {
    type: String,
    required: false,
  },
  telefono: {
    type: String,
    required: false,
  },
  fecha_nacimiento: {
    type: Date,
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

module.exports = PacienteSchema;

const DoctorSchema = {
    id_usuario: {
      type: String,
      required: true,
    },
    especialidad: {
      type: String,
      required: true,
    },
    biografia: {
      type: String,
      required: false,
    },
    disponible: {
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

module.exports = DoctorSchema;
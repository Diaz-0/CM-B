const UsuarioRSchema = {
    nombre: {
      type: String,
      required: true,
    },
    apellidos: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    id_rol: {
      type: Number,
      required: true,
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
  
  module.exports = UsuarioRSchema;
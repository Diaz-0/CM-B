const ChatSchema = {
  id_consulta: {
    type: Number,
    required: true,
  },
  id_emisor: {
    type: Number,
    required: true,
  },
  id_receptor: {
    type: Number,
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  },
  enviado_en: {
    type: Date,
    default: Date.now,
  },
};

module.exports = ChatSchema;

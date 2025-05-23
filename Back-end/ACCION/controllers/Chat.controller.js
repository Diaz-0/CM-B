const db = require("../../CONEXION/db");

class ChatController {
  async EnviarMensaje(req, res) {
    try {
      const { id_consulta, id_receptor, mensaje } = req.body;

      const id_usuario = req.user.userId;
      const queryEmisor = "SELECT id FROM usuarios WHERE id = ?";
      const [emisor] = await db.query(queryEmisor, [id_usuario]);

      if (!emisor || emisor.length === 0) {
        return res.status(404).json({ error: "No se encontró un emisor asociado a este usuario." });
      }

      const id_emisor_real = emisor[0].id;

      const queryReceptor = "SELECT id FROM usuarios WHERE id = ?";
      const [receptor] = await db.query(queryReceptor, [id_receptor]);

      if (!receptor || receptor.length === 0) {
        return res.status(404).json({ error: "No se encontró un receptor asociado al ID proporcionado." });
      }

      const id_receptor_real = receptor[0].id;


      const query = "INSERT INTO mensajes (id_consulta, id_emisor, id_receptor, mensaje) VALUES (?, ?, ?, ?)";
      await db.query(query, [id_consulta, id_emisor_real, id_receptor_real, mensaje]);

      res.status(201).json({ message: "Mensaje enviado exitosamente" });
    } catch (error) {
      console.error("Error al enviar mensaje:", error.message);
      res.status(500).json({ error: "Error al enviar mensaje" });
    }
  }

  async getHistorialChat(req, res) {
    try {
      const { id_consulta } = req.params;

      const query = "SELECT * FROM mensajes WHERE id_consulta = ? ORDER BY enviado_en ASC";
      const [mensajes] = await db.query(query, [id_consulta]);

      res.status(200).json(mensajes);
    } catch (error) {
      console.error("Error al obtener historial de chat:", error.message);
      res.status(500).json({ error: "Error al obtener historial de chat" });
    }
  }

  async getChatsActivos(req, res) {
    try {
      const { id } = req.params;

      const query = `
        SELECT DISTINCT id_consulta 
        FROM mensajes 
        WHERE id_emisor = ? OR id_receptor = ?`;
      const [chats] = await db.query(query, [id, id]);

      res.status(200).json(chats);
    } catch (error) {
      console.error("Error al listar chats activos:", error.message);
      res.status(500).json({ error: "Error al listar chats activos" });
    }
  }
}

module.exports = new ChatController();

const db = require("../../CONEXION/db");

class ConsultaController {
  async CrearConsulta(req, res) {
  try {
    const id_paciente = req.user.userId;
    
    const queryPaciente = "SELECT id FROM pacientes WHERE id_usuario = ?";
    const [paciente] = await db.query(queryPaciente, [id_paciente]);

    if (!paciente || paciente.length === 0) {
      return res.status(404).json({ error: "No se encontró un paciente asociado a este usuario." });
    }

    const id_paciente_real = paciente[0].id; // id del paciente real


    const { id_doctor, fecha_cita, motivo } = req.body;


    if (!id_doctor || !fecha_cita || !motivo) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const query = "INSERT INTO citas (id_paciente, id_doctor, fecha_cita, motivo) VALUES (?, ?, ?, ?)";
    await db.query(query, [id_paciente_real, id_doctor, fecha_cita, motivo]);
    

    return res.status(201).json({ message: "Consulta creada exitosamente" });
  } catch (error) {
    console.error("Error al crear consulta:", error.message);
    res.status(500).json({ error: "Error al crear consulta" });
  }

}

  async updateEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const query = "UPDATE citas SET estado = ? WHERE id = ?";
      await db.query(query, [estado, id]);

      res.status(200).json({ message: "Estado de consulta actualizado exitosamente" });
    } catch (error) {
      console.error("Error al actualizar el estado de la consulta:", error.message);
      res.status(500).json({ error: "Error al actualizar el estado de la consulta" });
    }
  }

  async getConsultasPorDoctor(req, res) {
    try {
      const id_doctor = req.user.userId;

      const queryDoctor = "SELECT id FROM doctores WHERE id_usuario = ?";
      const [doctor] = await db.query(queryDoctor, [id_doctor]);

      if (!doctor || doctor.length === 0) {
        return res.status(404).json({ error: "No se encontró un doctor asociado a este usuario." });
      }

      const id_doctor_real = doctor[0].id;

      const query = `
        SELECT c.*, u.nombre AS paciente_nombre, u.apellidos AS paciente_apellidos
        FROM citas c
        INNER JOIN pacientes p ON c.id_paciente = p.id
        INNER JOIN usuarios u ON p.id_usuario = u.id
        WHERE c.id_doctor = ?
      `;
      const [consultas] = await db.query(query, [id_doctor_real]);

      if (consultas.length === 0) {
        return res.status(404).json({ error: "No se encontraron consultas para este doctor." });
      }

      res.status(200).json(consultas);
    } catch (error) {
      console.error("Error al obtener consultas del doctor:", error.message);
      res.status(500).json({ error: "Error al obtener consultas del doctor" });
    }
  }

  async getConsultasPorPaciente(req, res) {
    try {
      const id_paciente = req.user.userId;

      const queryPaciente = "SELECT id FROM pacientes WHERE id_usuario = ?";
      const [paciente] = await db.query(queryPaciente, [id_paciente]);

      if (!paciente || paciente.length === 0) {
        return res.status(404).json({ error: "No se encontró un paciente asociado a este usuario." });
      }

      const id_paciente_real = paciente[0].id;

      const query = `
        SELECT c.*, u.nombre AS doctor_nombre, u.apellidos AS doctor_apellidos
        FROM citas c
        INNER JOIN doctores d ON c.id_doctor = d.id
        INNER JOIN usuarios u ON d.id_usuario = u.id
        WHERE c.id_paciente = ?
      `;
      const [consultas] = await db.query(query, [id_paciente_real]);

      if (consultas.length === 0) {
        return res.status(404).json({ error: "No se encontraron consultas para este paciente." });
      }

      res.status(200).json(consultas);
    } catch (error) {
      console.error("Error al obtener consultas del paciente:", error.message);
      res.status(500).json({ error: "Error al obtener consultas del paciente" });
    }
  }

}

module.exports = new ConsultaController();

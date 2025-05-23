const db = require("../../CONEXION/db");

class DoctorController {
  async getTodosDoctors(req, res) {
    try {
      const [doctors] = await db.query(`
        SELECT d.*, 
               u.nombre, 
               u.apellidos, 
               u.email
        FROM doctores d
        JOIN usuarios u ON d.id_usuario = u.id
      `);
      res.json(doctors);
    } catch (error) {
      console.error("Error al obtener doctores:", error);
      res.status(500).json({ error: "Error al obtener doctores" });
    }
  }

  async getDoctorPorId(req, res) {
    try {
      const { id } = req.params;
      const [doctor] = await db.query("SELECT * FROM doctores WHERE id = ?", [id]);

      if (doctor.length === 0) {
        return res.status(404).json({ error: "Doctor no encontrado" });
      }

      res.json(doctor[0]);
    } catch (error) {
      console.error("Error al obtener doctor:", error);
      res.status(500).json({ error: "Error al obtener doctor" });
    }
  }
  async updateDoctor(req, res) {
    try {
      const { id } = req.params;
      const { nombre, apellidos, email, especialidad, biografia, disponible } = req.body;


      const Ignorar = (value) => (value === "" ? null : value);

      const updateUserQuery = `
        UPDATE usuarios 
        SET nombre = IFNULL(?, nombre),
            apellidos = IFNULL(?, apellidos),
            email = IFNULL(?, email)
        WHERE id = (SELECT id_usuario FROM doctores WHERE id = ?)
      `;
      await db.query(updateUserQuery, [
        Ignorar(nombre),
        Ignorar(apellidos),
        Ignorar(email),
        id,
      ]);


      const updateDoctorQuery = `
        UPDATE doctores 
        SET especialidad = IFNULL(?, especialidad),
            biografia = IFNULL(?, biografia),
            disponible = IFNULL(?, disponible)
        WHERE id = ?
      `;
      
      await db.query(updateDoctorQuery, [
        Ignorar(especialidad),
        Ignorar(biografia),
        Ignorar(disponible),
        id,
    ]);


      res.status(200).json({ message: "Doctor actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar doctor:", error.message);
      res.status(500).json({ error: "Error al actualizar doctor" });
    }
}

  async deleteDoctor(req, res) {
    try {
      const { id } = req.params;

      await db.query("DELETE FROM doctores WHERE id = ?", [id]);

      res.json({ message: "Doctor eliminado exitosamente" });
    } catch (error) {
      console.error("Error al eliminar doctor:", error);
      res.status(500).json({ error: "Error al eliminar doctor" });
    }
  }
}

module.exports = new DoctorController();

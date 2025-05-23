const db = require("../../CONEXION/db");

class PacienteController {
    async getTodosPacientes(req, res) {
        try {
            const [pacientes] = await db.query("SELECT * FROM pacientes");
            res.json(pacientes);
            } catch (error) {
            console.error("Error al obtener pacientes:", error);
            res.status(500).json({ error: "Error al obtener pacientes" });
    }
}
    async getPacientePorId(req, res) {
    try {
        const { id } = req.params;
        const [paciente] = await db.query("SELECT * FROM pacientes WHERE id_usuario = ?", [id]);

        if (paciente.length === 0) {
            return res.status(404).json({ error: "paciente no encontrado" });
        }

        res.json(paciente[0]);
    } catch (error) {
        console.error("Error al obtener paciente:", error);
        res.status(500).json({ error: "Error al obtener paciente" });
    }
}

    async updatePaciente(req, res) {
        try {
            const { id } = req.params;
            const {nombre, apellidos, email, historial_medico, direccion, telefono, fecha_nacimiento, curp,} = req.body;
            
            const Ignorar = (value) => (value === "" ? null : value);

            const updateUserQuery = `
                UPDATE usuarios 
                SET nombre = IFNULL(?, nombre),
                    apellidos = IFNULL(?, apellidos),
                    email = IFNULL(?, email)
                WHERE id = (SELECT id_usuario FROM pacientes WHERE id = ?)
            `;
            await db.query(updateUserQuery, [
                Ignorar(nombre),
                Ignorar(apellidos),
                Ignorar(email),
                id,
            ]);

            const updatePatientQuery = `
                UPDATE pacientes 
                SET historial_medico = IFNULL(?, historial_medico),
                    direccion = IFNULL(?, direccion),
                    telefono = IFNULL(?, telefono),
                    fecha_nacimiento = IFNULL(?, fecha_nacimiento),
                    curp = IFNULL(?, curp)
                WHERE id = ?
            `;
            await db.query(updatePatientQuery, [
                Ignorar(historial_medico),
                Ignorar(direccion),
                Ignorar(telefono),
                Ignorar(fecha_nacimiento),
                Ignorar(curp),
                id,
            ]);

            res.status(200).json({ message: "Paciente actualizado correctamente" });
            } catch (error) {
            console.error("Error al actualizar paciente:", error.message);
            res.status(500).json({ error: "Error al actualizar paciente" });
    }
}


async deletePaciente(req, res) {
  try {
    const { id } = req.params;


    const patientQuery = "SELECT id_usuario FROM pacientes WHERE id_usuario = ?";
    const [patient] = await db.query(patientQuery, [id]);

    if (patient.length === 0) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    const idUsuario = patient[0].id_usuario;


    await db.query("DELETE FROM pacientes WHERE id_usuario = ?", [id]);


    await db.query("DELETE FROM usuarios WHERE id = ?", [idUsuario]);

    res.json({ message: "Paciente y usuario eliminados exitosamente" });
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    res.status(500).json({ error: "Error al eliminar paciente" });
  }
}


}

module.exports = new PacienteController();

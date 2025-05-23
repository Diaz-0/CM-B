const db = require("../../CONEXION/db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../CONEXION/constants");

class UsuarioController {
  async Registro(req, res) {
    try {
      const { nombre, apellidos, email, password, id_rol, curp, historial_medico, direccion, telefono, fecha_nacimiento } = req.body;

      if (id_rol !== 3) {
        return res.status(403).json({ error: "No tienes permiso para registrarte como doctor o administrador." });
      }

      const userExistsQuery = "SELECT * FROM usuarios WHERE email = ?";
      const [existingUser] = await db.query(userExistsQuery, [email]);

      if (existingUser.length > 0) {
        return res.status(400).json({ error: "El correo ya está registrado" });
      }

      const newUser = { nombre, apellidos, email, password, id_rol };
      const insertUserQuery = "INSERT INTO usuarios SET ?";
      const [createdUser] = await db.query(insertUserQuery, [newUser]);
      const newUserId = createdUser.insertId;

      if (id_rol === 3) {
        const newPaciente = { id_usuario: newUserId, curp, historial_medico, direccion, telefono, fecha_nacimiento, };
        const insertPacienteQuery = "INSERT INTO pacientes SET ?";
        await db.query(insertPacienteQuery, [newPaciente]);
      }

      res.status(201).json({ id: createdUser.insertId, ...newUser });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  }

  async RegistroPorAdmin(req, res) {
    try {
      if (req.user.id_rol !== 1 && req.user.id_rol !== 2) {
        return res.status(403).json({ error: "No tienes permisos para registrar doctores o administradores." });
      }

      const { nombre, apellidos, email, password, id_rol, especialidad, biografia, disponible  } = req.body;

      if (![1, 2].includes(id_rol)) {
        return res.status(400).json({ error: "Rol no válido para este registro." });
      }

      const userExistsQuery = "SELECT * FROM usuarios WHERE email = ?";
      const [existingUser] = await db.query(userExistsQuery, [email]);

      if (existingUser.length > 0) {
        return res.status(400).json({ error: "El correo ya está registrado" });
      }

      const newUser = { nombre, apellidos, email, password, id_rol };
      const insertUserQuery = "INSERT INTO usuarios SET ?";
      const [createdUser] = await db.query(insertUserQuery, [newUser]);
      const newUserId = createdUser.insertId;

      if (id_rol === 2) {
        const newDoctor = { id_usuario: newUserId, especialidad, biografia, disponible };
        const insertDoctorQuery = "INSERT INTO doctores SET ?";
        await db.query(insertDoctorQuery, [newDoctor]);
      }

      res.status(201).json({ id: createdUser.insertId, ...newUser });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  }

  async IniciarSesion(req, res) {
    const { email, password } = req.body;

    try {
      const query = "SELECT * FROM usuarios WHERE email = ?";
      const [usersByEmail] = await db.query(query, [email]);

      if (usersByEmail.length === 0) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const user = usersByEmail[0];

      if (user.password !== password) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const token = jwt.sign({ userId: user.id, id_rol: user.id_rol }, JWT_SECRET, { expiresIn: "1h" });

      // Devolver también los datos del usuario junto con el token
      res.json({
        message: `Inicio de sesión exitoso. ¡Bienvenido(a), ${user.email}!`,
        token,
        usuario: {
          id: user.id,
          nombre: user.nombre,
          apellidos: user.apellidos,
          email: user.email,
          id_rol: user.id_rol
        }
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  }

  async getUsuarioPorId(req, res) {
    try {
      const userId = req.params.id;

      const query = "SELECT * FROM usuarios WHERE id = ?";
      const [user] = await db.query(query, [userId]);

      if (user.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json(user[0]);
    } catch (error) {
      console.error("Error al obtener el usuario por ID:", error);
      res.status(500).json({ error: "Error al obtener el usuario por ID" });
    }
  }

  async getTodosUsuarios(req, res) {
    try {
      const query = "SELECT * FROM usuarios";
      const [users] = await db.query(query);

      res.json(users);
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      res.status(500).json({ error: "Error al obtener todos los usuarios" });
    }
  }
}

module.exports = new UsuarioController();

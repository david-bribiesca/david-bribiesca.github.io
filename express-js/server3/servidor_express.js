import express from "express";

const app = express();
const puerto = 1984;

//Express me facilita el manejo de rutas, Facilita mucho como manejamos las solicitudes y respuestas. Ademas que utiliza muchas menos lineas de codigo que no utilizar express. Sinceramente creo que es una herramienta indispensable para el desarrollo de aplicaciones web con node.


app.use(express.json());
app.use(express.static("public"));

// --- DATOS SIMULADOS ---
const usuariosDB = {
  user: [
    { nombre: "Punk", saldo: "0" },
    { nombre: "Peter", saldo: "100" },
    { nombre: "David", saldo: "250" },
  ],
};

const movimientosDB = {
  movimientos: [
    { tipo: "deposito", monto: 500, fecha: "2024-01-10" },
    { tipo: "retiro", monto: 200, fecha: "2024-01-15" },
    { tipo: "transferencia", monto: 100, fecha: "2024-01-20" },
  ],
};

const tiendasConvenio = {
  amazon: 5, temu: 8, shein: 10, walmart: 3,
  mercadolibre: 6, liverpool: 4, palacio: 7, zara: 9,
};

const limitesCredito = {
  punk: 0, peter: 5000, david: 12000,
};

// --- RUTAS PARA SERVIR ARCHIVOS HTML ---
// Obtenemos la ruta absoluta del directorio de trabajo actual
const directorioBase = process.cwd();

// Usamos template literals en lugar del módulo path para concatenar las rutas
app.get("/", (req, res) => res.sendFile(`${directorioBase}/bienvenida.html`));
app.get("/usuarios", (req, res) => res.sendFile(`${directorioBase}/usuarios.html`));
app.get("/perfil", (req, res) => res.sendFile(`${directorioBase}/perfil.html`));
app.get("/movimientos", (req, res) => res.sendFile(`${directorioBase}/movimientos.html`));
app.get("/equipo", (req, res) => res.sendFile(`${directorioBase}/equipo.html`));
app.get("/opinion", (req, res) => res.sendFile(`${directorioBase}/opinion.html`));
app.get("/arbol", (req, res) => res.sendFile(`${directorioBase}/arbol.html`));

// --- RUTAS DE API (GET) ---
app.get("/api/usuarios", (req, res) => {
  res.json(usuariosDB);
});

app.get("/api/movimientos", (req, res) => {
  res.json(movimientosDB);
});

app.get("/api/convenio", (req, res) => {
  const tienda = req.query.tienda;

  if (!tienda) {
    return res.status(400).json({ error: "Falta el parámetro 'tienda'" });
  }

  const tiendaNormalizada = tienda.toLowerCase();
  const cashback = tiendasConvenio[tiendaNormalizada];
  const tieneConvenio = cashback !== undefined;

  res.json({
    tienda: tiendaNormalizada,
    convenio: tieneConvenio,
    cashback: tieneConvenio ? `${cashback}%` : null,
  });
});

app.get("/api/limite", (req, res) => {
  const nombre = req.query.nombre;

  if (!nombre) {
    return res.status(400).json({ error: "Falta el parámetro 'nombre'" });
  }

  const nombreNormalizado = nombre.toLowerCase();
  const limite = limitesCredito[nombreNormalizado];

  if (limite === undefined) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json({
    usuario: nombreNormalizado,
    limiteCredito: limite,
    disponible: limite > 0,
  });
});

// --- RUTAS DE API (POST) ---
app.post("/api/registro", (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: "Se requieren correo y contrasena" });
  }

  res.status(201).json({
    mensaje: "Usuario creado exitosamente",
    usuario: { correo },
  });
});

app.post("/api/pago", (req, res) => {
  const { monto, destino, concepto } = req.body;

  if (!monto || !destino) {
    return res.status(400).json({ error: "Se requieren monto y destino" });
  }

  if (monto <= 0) {
    return res.status(400).json({ error: "El monto debe ser mayor a 0" });
  }

  res.json({
    mensaje: "Pago realizado exitosamente",
    pago: {
      monto,
      destino,
      concepto: concepto || "Sin concepto",
      fecha: new Date().toISOString(),
    },
  });
});

// --- MANEJO DE ERROR 404 ---
app.use((req, res) => {
  res.status(404).send("Esta ruta no existe, ¡no te perdiste de nada!");
});

// --- INICIAR SERVIDOR ---
app.listen(puerto, () => {
  console.log(`Servidor de Express escuchando en el puerto ${puerto}`);
});
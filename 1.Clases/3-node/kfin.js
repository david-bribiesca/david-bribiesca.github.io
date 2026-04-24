// http es un módulo de Node.js que permite crear servidores web y manejar solicitudes/respuestas HTTP
import http from "http";
// fs (file system) es un módulo de Node.js que permite leer y escribir archivos del sistema operativo
import fs from "fs";

function darBienvenida(req, res) {
  fs.readFile("bienvenida.html", "utf8", (error, data) => {
    if (error) {
      // 500 significa "Internal Server Error": algo salió mal del lado del servidor
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Oh no!!!!");
      return;
    }
    // 200 significa "OK": la solicitud fue exitosa y se envía la respuesta correctamente
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
}

function getUsuarios(req, res) {
  const usuario = {
    user: [
      {
        nombre: "Punk",
        saldo: "0",
      },
      {
        nombre: "Peter",
        saldo: "100",
      },
      {
        nombre: "David",
        saldo: "250",
      },
    ],
  };

  res.writeHead(200, { "Content-Type": "application/json" });

  // JSON.stringify convierte un objeto JavaScript en una cadena de texto en formato JSON.
  // La necesitamos porque res.end() solo puede enviar texto o bytes, no objetos JS directamente.
  res.end(JSON.stringify(usuario));
}

function mostrarPerfil(req, res) {
  fs.readFile("perfil.html", "utf8", (error, data) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Oh no!!!!");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
}

function mostrarUsuarios(_req, res) {
  fs.readFile("usuarios.html", "utf8", (error, data) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Oh no!!!!");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
}

function mostrarMovimientos(req, res) {
  fs.readFile("movimientos.html", "utf8", (error, data) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Oh no!!!!");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
}

function getMovimientos(_req, res) {
  const movimientos = {
    movimientos: [
      { tipo: "deposito", monto: 500, fecha: "2024-01-10" },
      { tipo: "retiro", monto: 200, fecha: "2024-01-15" },
      { tipo: "transferencia", monto: 100, fecha: "2024-01-20" },
    ],
  };
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(movimientos));
}

function mostrarEquipo(_req, res) {
  fs.readFile("equipo.html", "utf8", (error, data) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Oh no!!!!");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
}

function mostrarOpinion(req, res) {
  fs.readFile("opinion.html", "utf8", (error, data) => {
    if (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Oh no!!!!");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
}

// Tiendas con convenio y su porcentaje de cashback
const tiendasConvenio = {
  amazon: 5,
  temu: 8,
  shein: 10,
  walmart: 3,
  mercadolibre: 6,
  liverpool: 4,
  palacio: 7,
  zara: 9,
};

function getConvenio(req, res) {
  // Parseamos la URL para obtener el query param "tienda"
  const urlObj = new URL(req.url, "http://localhost");
  const tienda = urlObj.searchParams.get("tienda");

  if (!tienda) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Falta el parámetro 'tienda'" }));
    return;
  }

  const tiendaNormalizada = tienda.toLowerCase();
  const cashback = tiendasConvenio[tiendaNormalizada];
  const tieneConvenio = cashback !== undefined;

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      tienda: tiendaNormalizada,
      convenio: tieneConvenio,
      cashback: tieneConvenio ? `${cashback}%` : null,
    })
  );
}

function registrarUsuario(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    let datos;
    try {
      datos = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "El cuerpo debe ser JSON válido" }));
      return;
    }

    const { correo, contrasena } = datos;

    if (!correo || !contrasena) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Se requieren correo y contrasena" }));
      return;
    }

    // Simulación: en una app real aquí guardaríamos en base de datos
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        mensaje: "Usuario creado exitosamente",
        usuario: { correo },
      })
    );
  });
}

const limitesCredito = {
  punk: 0,
  peter: 5000,
  david: 12000,
};

function getLimiteCredito(req, res) {
  const urlObj = new URL(req.url, "http://localhost");
  const nombre = urlObj.searchParams.get("nombre");

  if (!nombre) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Falta el parámetro 'nombre'" }));
    return;
  }

  const nombreNormalizado = nombre.toLowerCase();
  const limite = limitesCredito[nombreNormalizado];

  if (limite === undefined) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Usuario no encontrado" }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      usuario: nombreNormalizado,
      limiteCredito: limite,
      disponible: limite > 0,
    })
  );
}

function realizarPago(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    let datos;
    try {
      datos = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "El cuerpo debe ser JSON válido" }));
      return;
    }

    const { monto, destino, concepto } = datos;

    if (!monto || !destino) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Se requieren monto y destino" }));
      return;
    }

    if (monto <= 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "El monto debe ser mayor a 0" }));
      return;
    }

    // Simulación: en una app real aquí se procesaría el pago
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        mensaje: "Pago realizado exitosamente",
        pago: {
          monto,
          destino,
          concepto: concepto || "Sin concepto",
          fecha: new Date().toISOString(),
        },
      })
    );
  });
}

function manejarRuta404(req, res) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Esta ruta no existe, ¡no te perdiste de nada!");
}

// Documentación oficial: https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
const servidor = http.createServer((req, res) => {
  const url = req.url;
  const metodo = req.method;

  if (url === "/") {
    darBienvenida(req, res);
  } else if (url === "/api/usuarios" && metodo === "GET") {
    getUsuarios(req, res);
  } else if (url.startsWith("/api/convenio") && metodo === "GET") {
    getConvenio(req, res);
  } else if (url === "/api/registro" && metodo === "POST") {
    registrarUsuario(req, res);
  } else if (url.startsWith("/api/limite") && metodo === "GET") {
    getLimiteCredito(req, res);
  } else if (url === "/api/pago" && metodo === "POST") {
    realizarPago(req, res);
  } else if (url === "/api/movimientos") {
    getMovimientos(req, res);
  } else if (url === "/usuarios") {
    mostrarUsuarios(req, res);
  } else if (url === "/perfil") {
    mostrarPerfil(req, res);
  } else if (url === "/movimientos") {
    mostrarMovimientos(req, res);
  } else if (url === "/equipo") {
    mostrarEquipo(req, res);
  } else if (url === "/opinion") {
    mostrarOpinion(req, res);
  } else {
    manejarRuta404(req, res);
  }
});

const puerto = 1984;
servidor.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});

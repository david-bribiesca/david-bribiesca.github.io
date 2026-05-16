import express from "express";

const app = express();
const puerto = 1984;

let prestamosKueski = [
  { id: 1, usuario: "Punk", monto: 5000, estado: "activo" },
  { id: 2, usuario: "Peter", monto: 1200, estado: "activo" },
  { id: 3, usuario: "David", monto: 8500, estado: "activo" }
];

app.use(express.json());

app.get("/api/prestamos/:id", (req, res) => {
  const idBuscado = parseInt(req.params.id);
  const prestamo = prestamosKueski.find(p => p.id === idBuscado);

  if (!prestamo) {
    return res.status(404).json({ error: "Préstamo no encontrado en el sistema" });
  }

  res.status(200).json(prestamo);
});

app.delete("/api/prestamos/:id", (req, res) => {
  const idBuscado = parseInt(req.params.id);
  const indice = prestamosKueski.findIndex(p => p.id === idBuscado);

  if (indice === -1) {
    return res.status(404).json({ error: "No se encontró el préstamo para liquidar" });
  }

  prestamosKueski.splice(indice, 1);

  res.status(200).json({ 
    mensaje: "Préstamo liquidado y eliminado con éxito",
    prestamosRestantes: prestamosKueski
  });
});

app.listen(puerto, () => {
  console.log(`Servidor de Kueski corriendo en el puerto ${puerto}`);
});
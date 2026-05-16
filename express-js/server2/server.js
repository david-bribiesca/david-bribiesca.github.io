import mysql from "mysql2";
import express from "express";
//import { fileURLToPath  } from 'url';
//import path from 'path';

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: "mysql-39b03a90-dabrival03.b.aivencloud.com",
  port: 22746,
  user: "avnadmin",
  password: "AVNS_ontfuibJigjnGFBKgBx",
  database: "defaultdb",
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Conectada");
});

app.listen(1984, () => {
  console.log("Up and up");
});

app.get("/bienvenida", (req, res) => {
  res.send("Esto no es una página html");
});

app.get("/ofertas", (req, res) => {
  const consultaSQL = `
  SELECT * FROM Kueski_ofertas;
`;

  connection.query(consultaSQL, (error, resultados) => {
    if (error) throw error;
    res.json(resultados);
    console.log(resultados);
    connection.end();
  });
});

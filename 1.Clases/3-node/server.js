import http from "http";
import url from "url";

const servidor = http.createServer((req, res) => {
  console.log("Alguien me mandó una solicitud");
  //console.log(req);
  const urlProcesada = url.parse(req.url, true);
  //console.log(urlProcesada);
  const queryParams = urlProcesada.query;
  if(queryParams.x % 2 === 0){
    console.log("Es par");
  } else {
    console.log("Es impar");
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(
    "Quiero la libertad de esculpir y cincelar mi propio rostro, de detener la hemorragia con cenizas, de crear mis propios dioses a partir de mis entrañas...\n",
  );
});

const puerto = 1988;

servidor.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});

import http from 'http';

const CLIENT_SECRET = 'TU_CLIENT_SECRET_AQUI'; 
const SUBMIT_URL = 'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/';

async function evaluarCodigo() {
  const payload = {
    lang: "PYTHON3",
    source: "print('¡Hola desde HackerEarth!')\nfor i in range(1, 4): print(f'Línea {i}')",
    input: "",
    memory_limit: 262144,
    time_limit: 5
  };

  try {
    const postResponse = await fetch(SUBMIT_URL, {
      method: 'POST',
      headers: {
        'client-secret': CLIENT_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const postData = await postResponse.json();
    
    if (postData.request_status && postData.request_status.code === 'REQUEST_QUEUED') {
        const statusUrl = postData.status_update_url; 
        return await revisarEstado(statusUrl); 
    } else {
        return `Error al encolar: ${JSON.stringify(postData)}`;
    }

  } catch (error) {
    return `Error de red: ${error.message}`;
  }
}

async function revisarEstado(url) {
  let completado = false;

  while (!completado) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const getResponse = await fetch(url, {
      method: 'GET',
      headers: { 'client-secret': CLIENT_SECRET }
    });

    const data = await getResponse.json();
    const estado = data.request_status.code;

    if (estado === 'REQUEST_COMPLETED') {
      const outputUrl = data.result.run_status.output;
      
      if (outputUrl) {
         const outputResponse = await fetch(outputUrl);
         return await outputResponse.text(); 
      } else {
         return "Sin salida en consola.";
      }
    } else if (estado === 'REQUEST_FAILED') {
      return "Fallo interno en la evaluación.";
    }
  }
}

const servidor = http.createServer(async (req, res) => {
  console.log("Alguien visitó el servidor. Ejecutando código...");
  
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  
  res.write('--- Conectando con los servidores de HackerEarth ---\n\n');

  const resultado = await evaluarCodigo();

  res.end(`RESULTADO DEL CÓDIGO PYTHON:\n${resultado}`);
});

const puerto = 1984;

servidor.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
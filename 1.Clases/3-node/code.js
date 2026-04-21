const CLIENT_SECRET = 'ff0a6cc7e0ce61c068a9d2762027a63498e499f2'; 
const SUBMIT_URL = 'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/';

async function evaluarCodigo() {
  const payload = {
    lang: "PYTHON3",
    source: "print('Hola Mundo')",
    input: "",
    memory_limit: 262144,
    time_limit: 5
  };

  try {
    console.log("Enviando código a los servidores de HackerEarth...");
    
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
        console.log("Código encolado con éxito. ID:", postData.he_id);
        const statusUrl = postData.status_update_url; 
        await revisarEstado(statusUrl);
    } else {
        console.error("Hubo un error al encolar:", postData);
    }

  } catch (error) {
    console.error("Error de red:", error);
  }
}

async function revisarEstado(url) {
  let completado = false;

  console.log("Esperando ejecución...");

  while (!completado) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const getResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'client-secret': CLIENT_SECRET
      }
    });

    const data = await getResponse.json();
    const estado = data.request_status.code;
    
    console.log(`Estado actual: ${estado}`);

    if (estado === 'REQUEST_COMPLETED') {
      completado = true;
      console.log("\n¡Ejecución terminada!");
      
      const outputUrl = data.result.run_status.output;
      
      if (outputUrl) {
         const outputResponse = await fetch(outputUrl);
         const resultadoFinal = await outputResponse.text();
         console.log("-----------------------");
         console.log("RESULTADO EN CONSOLA:\n" + resultadoFinal);
         console.log("-----------------------");
      } else {
         console.log("El código se ejecutó pero no generó salida en la consola.");
      }
      
    } else if (estado === 'REQUEST_FAILED') {
      completado = true;
      console.log("La evaluación falló por un problema interno.");
    }
  }
}

evaluarCodigo();
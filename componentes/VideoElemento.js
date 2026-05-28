const template = document.createElement("template");
// Estructura simple: Un título y el video embebido
// Usamos un ID 'videoFrame' para poder acceder a él si quisiéramos cambiar el src después, 
// pero aquí lo pondremos directo en el HTML o en el constructor.
template.innerHTML = `
  <h1>Video: <span id='tituloVideo'></span></h1>
  <div>
    <iframe 
      id='miVideo' 
      width="560" 
      height="315" 
      src="" 
      frameborder="0" 
      allowfullscreen>
    </iframe>
  </div>
`;

class VideoElemento extends HTMLElement {
  constructor() {
    super();
    
    // 1. Crear el Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });
    
    // 2. Clonar el contenido de la plantilla
    const templateContent = template.content.cloneNode(true);
    shadow.append(templateContent);

    // 3. Obtener el atributo 'identificador' del elemento HTML
    // Ejemplo de uso: <video-elemento identificador="KQSnNI1QlXk"></video-elemento>
    const videoId = this.getAttribute("identificador");
    
    // 4. Configurar el iframe con el ID del video de YouTube
    const iframe = shadow.getElementById('miVideo');
    if (iframe && videoId) {
      // Construir la URL de embed de YouTube
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
    }

    // Opcional: Poner un título dinámico si quieres usar otro atributo, 
    // pero si quieres ser 100% fiel al ejemplo, solo usamos el ID.
    const spanTitulo = shadow.getElementById('tituloVideo');
    if (spanTitulo) {
        // Mostramos el ID del video como título o un texto genérico
        spanTitulo.textContent = videoId || "Sin ID";
    }

    console.log("Constructor VideoElemento ", this);
  }
}

// 5. Definir el componente
customElements.define("video-elemento", VideoElemento);
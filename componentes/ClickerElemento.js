const clickerTemplate = document.createElement("template");
// Plantilla sencilla: Solo un botón
clickerTemplate.innerHTML = `
  <button id="btnClicker"></button>
`;

class ClickerElemento extends HTMLElement {
  constructor() {
    super();
    
    // 1. Crear el Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });
    
    // 2. Clonar e insertar el contenido de la plantilla
    const templateContent = clickerTemplate.content.cloneNode(true);
    shadow.append(templateContent);

    // 3. Obtener los atributos personalizados del elemento HTML
    // Ejemplo: <clicker-elemento inicio="10" incremento="5"></clicker-elemento>
    const atributoInicio = this.getAttribute("inicio");
    const atributoIncremento = this.getAttribute("incremento");

    // Convertimos los atributos a números. Si no existen, usamos valores por defecto (0 y 1).
    this.contador = atributoInicio ? parseInt(atributoInicio) : 0;
    this.incremento = atributoIncremento ? parseInt(atributoIncremento) : 1;

    // 4. Configurar el botón dentro del Shadow DOM
    const boton = shadow.getElementById('btnClicker');
    
    if (boton) {
      // Mostrar el valor inicial
      boton.textContent = `Clics: ${this.contador}`;

      // Configurar el evento para que sume el incremento
      boton.addEventListener('click', () => {
        this.contador += this.incremento;
        boton.textContent = `Clics: ${this.contador}`;
      });
    }

    console.log("Constructor ClickerElemento", this);
  }
}

// 5. Definir el componente
customElements.define("clicker-elemento", ClickerElemento);
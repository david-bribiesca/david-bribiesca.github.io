const template = document.createElement("template");
template.innerHTML =
  "<div><h1>Oferta: <span id='nombreOferta'></span></h1></div><input type='text' id='myInput'>";

class OfertaElemento extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    //this.textContent="oferta";
    //this.append(template.content);
    const templateContent = template.content.cloneNode(true);
    shadow.append(templateContent);
    console.log("Constructor ", this);

    const span = shadow.getElementById("nombreOferta");
    if (span) span.textContent = this.getAttribute("nombre");

    this.input = shadow.querySelector("#myInput");
    this.input.addEventListener("input", (e) => this.handleInput(e));
  }

  handleInput() {
    console.log("Tecleaste...");
    this.setAttribute("value", this.input.value);
  }
  static get observedAttributes() {
    return ["value"];
  }
  attributeChangedCallback(name, old, nw) {
    console.log(`Cambio ${name} de ${old} a ${nw}`);
    if(name === "value") {
      //agrega algo aqui para que en lugar de lo que teniamos salga lo que escribamos en el input
      const span = this.shadowRoot.getElementById("nombreOferta");
      if(span) span.textContent = nw;
    }
  }
}

customElements.define("oferta-elemento", OfertaElemento);

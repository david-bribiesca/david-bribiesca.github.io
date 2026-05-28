<script>
  let {id, width, height} = $$props;
</script>


<h1>Video: <span id="tituloVideo"></span></h1>
<div>
<input/>
  <iframe
    width={width}
    height={height}
    src={`https://www.youtube.com/embed/${id}`}
    frameborder="0"
    allowfullscreen
    title="Hola"
  >
  </iframe>
</div>

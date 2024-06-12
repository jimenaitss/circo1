document.addEventListener('DOMContentLoaded', function() {
  const bola = document.getElementById('bola');
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  const velocidad = 5;

  function actualizarPosicion() {
    bola.style.left = x + 'px';
    bola.style.top = y + 'px';
  }

  function manejarTeclado(event) {
    switch(event.key) {
      case 'ArrowLeft':
        x -= velocidad;
        break;
      case 'ArrowRight':
        x += velocidad;
        break;
      case 'ArrowUp':
        y -= velocidad;
        break;
      case 'ArrowDown':
        y += velocidad;
        break;
    }
    actualizarPosicion();
  }

  document.addEventListener('keydown', manejarTeclado);
});

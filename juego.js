window.onload = function() {
    const canvas = document.getElementById('myCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const moonRadius = 59;
    let moonX = 59;
    let moonY = canvas.height / 8;

    const clouds = [
        { x: 50, y: 100, speed: 0.5 },
        { x: 300, y: 150, speed: 0.3 },
        { x: 600, y: 50, speed: 0.2 }
    ];

    const stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2
        });
    }

    const pines = [];
    for (let i = 0; i < canvas.width; i += 60) {
        pines.push({
            x: i,
            y: canvas.height - 50,
            size: 50 + Math.random() * 30
        });
    }

    function drawSky() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawMoon(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, moonRadius, 5, Math.PI * 8, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();
    }

    function drawCloud(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 30, Math.PI * 0.5, Math.PI * 1.5);
        ctx.arc(x + 40, y - 30, 40, Math.PI * 1, Math.PI * 1.85);
        ctx.arc(x + 80, y - 30, 30, Math.PI * 1.37, Math.PI * 1.91);
        ctx.arc(x + 100, y, 30, Math.PI * 1.5, Math.PI * 0.5);
        ctx.moveTo(x + 100, y + 30);
        ctx.lineTo(x, y + 30);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Blanco transparente
        ctx.fill();
        ctx.closePath();
    }

    function drawStar(x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 5, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();
    }

    function drawPine(x, y, size) {
        ctx.fillStyle = 'darkgreen';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size / 1, y + size);
        ctx.lineTo(x - size / 1, y + size);
        ctx.closePath();
        ctx.fill();
        
        
    }

    function drawMountain(x, y, width, height) {
        ctx.fillStyle = 'grey';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width / 2, y - height);
        ctx.lineTo(x + width, y);
        ctx.closePath();
        ctx.fill();
    }

    function animate() {
        drawSky();

        stars.forEach(star => {
            drawStar(star.x, star.y, star.radius);
        });

        drawMoon(moonX, moonY);

        clouds.forEach(cloud => {
            drawCloud(cloud.x, cloud.y);
            cloud.x += cloud.speed;
            if (cloud.x - 100 > canvas.width) {
                cloud.x = -100;
            }
        });

        // Dibujar montañas
        drawMountain(100, canvas.height - 6, 280, 200);
        
        drawMountain(200, canvas.height - 10, 480, 300);
        
        drawMountain(10, canvas.height - 10, 170, 200);
        
       
        pines.forEach(pine => {
            drawPine(pine.x, pine.y , pine.size);
        });

        moonX += 0; // Velocidad de la luna en el eje X

        // Reinicia la posición de la luna cuando salga del lienzo
        if (moonX - moonRadius > canvas.width) {
            moonX = -moonRadius;
        }

        requestAnimationFrame(animate);
    }

    animate();
};

<script>
  document.addEventListener('DOMContentLoaded', function () {
    const jugador = document.getElementById('jugador');
    const obstaculos = document.querySelectorAll('.obstaculo');
    const salidas = document.querySelectorAll('.salida');
    const habitacion = document.querySelector('.habitacion');
    const vidaBarra = document.getElementById('vidaBarra');
    const botonPausa = document.getElementById('botonPausa');
    let jugadorX, jugadorY, vida;
    const velocidadMovimiento = 2;
    const velocidadPersecucion = 1;
    const velocidadBola = 5;
    let juegoEnPausa = false;
    let intervaloObstaculos;
    let direccionMovimiento = { izquierda: false, derecha: false, arriba: false, abajo: false };
    let bolas = [];

    function iniciarJuego() {
      jugadorX = 20;
      jugadorY = habitacion.offsetHeight - 60;
      vida = 100;
      vidaBarra.style.width = vida + '%';
      jugador.style.left = jugadorX + 'px';
      jugador.style.top = jugadorY + 'px';
      juegoEnPausa = false;
      intervaloObstaculos = setInterval(moverObstaculos, 100);
      animarMovimiento();
    }

    function animarMovimiento() {
      if (direccionMovimiento.izquierda) {
        jugadorX = Math.max(jugadorX - velocidadMovimiento, 0);
      }
      if (direccionMovimiento.derecha) {
        jugadorX = Math.min(jugadorX + velocidadMovimiento, habitacion.offsetWidth - 40);
      }
      if (direccionMovimiento.arriba) {
        jugadorY = Math.max(jugadorY - velocidadMovimiento, 0);
      }
      if (direccionMovimiento.abajo) {
        jugadorY = Math.min(jugadorY + velocidadMovimiento, habitacion.offsetHeight - 40);
      }

      jugador.style.left = jugadorX + 'px';
      jugador.style.top = jugadorY + 'px';

      moverBolas();
      verificarSalida();
      verificarColision();

      if (!juegoEnPausa) {
        requestAnimationFrame(animarMovimiento);
      }
    }

    function verificarSalida() {
      for (const salida of salidas) {
        const salidaRect = salida.getBoundingClientRect();
        const jugadorRect = jugador.getBoundingClientRect();
        if (
          jugadorRect.right >= salidaRect.left &&
          jugadorRect.left <= salidaRect.right &&
          jugadorRect.bottom >= salidaRect.top &&
          jugadorRect.top <= salidaRect.bottom
        ) {
          if (salida.classList.contains('salida-correcta')) {
            alert('¡Felicidades! ¡Has encontrado la salida correcta!');
            window.location.href = 'siguiente-nivel.html'; // Redirige al siguiente nivel
          } else {
            alert('¡Esta no es la salida correcta! Sigue buscando.');
          }
          return;
        }
      }
    }

    function verificarColision() {
      for (const obstaculo of obstaculos) {
        const obstaculoRect = obstaculo.getBoundingClientRect();
        const jugadorRect = jugador.getBoundingClientRect();
        if (
          jugadorRect.right >= obstaculoRect.left &&
          jugadorRect.left <= obstaculoRect.right &&
          jugadorRect.bottom >= obstaculoRect.top &&
          jugadorRect.top <= obstaculoRect.bottom
        ) {
          vida -= 1;
          vidaBarra.style.width = vida + '%';

          if (vida <= 1) {
            alert('¡Game Over!');
            iniciarJuego();
            return;
          }
        }
      }
    }

    function moverObstaculos() {
      for (const obstaculo of obstaculos) {
        const obstaculoX = parseFloat(obstaculo.style.left);
        const obstaculoY = parseFloat(obstaculo.style.top);

        if (obstaculoX < jugadorX) {
          obstaculo.style.left = (obstaculoX + velocidadPersecucion) + 'px';
        } else {
          obstaculo.style.left = (obstaculoX - velocidadPersecucion) + 'px';
        }

        if (obstaculoY < jugadorY) {
          obstaculo.style.top = (obstaculoY + velocidadPersecucion) + 'px';
        } else {
          obstaculo.style.top = (obstaculoY - velocidadPersecucion) + 'px';
        }

        verificarColision();
      }
    }

    function handleKeyDown(event) {
      switch (event.key) {
        case 'ArrowLeft':
          direccionMovimiento.izquierda = true;
          break;
        case 'ArrowRight':
          direccionMovimiento.derecha = true;
          break;
        case 'ArrowUp':
          direccionMovimiento.arriba = true;
          break;
        case 'ArrowDown':
          direccionMovimiento.abajo = true;
          break;
        case ' ':
          lanzarBola();
          break;
      }
    }

    function handleKeyUp(event) {
      switch (event.key) {
        case 'ArrowLeft':
          direccionMovimiento.izquierda = false;
          break;
        case 'ArrowRight':
          direccionMovimiento.derecha = false;
          break;
        case 'ArrowUp':
          direccionMovimiento.arriba = false;
          break;
        case 'ArrowDown':
          direccionMovimiento.abajo = false;
          break;
      }
    }

    function lanzarBola() {
      const bola = document.createElement('div');
      bola.className = 'bola';
      bola.style.left = (jugadorX + 20) + 'px';
      bola.style.top = (jugadorY + 15) + 'px';
      habitacion.appendChild(bola);
      bolas.push(bola);
    }

    function moverBolas() {
      bolas = bolas.filter(bola => {
        let bolaX = parseFloat(bola.style.left);
        bolaX += velocidadBola;
        bola.style.left = bolaX + 'px';

        if (bolaX > habitacion.offsetWidth) {
          habitacion.removeChild(bola);
          return false;
        }
        return true;
      });
    }

    function pausarJuego() {
      if (!juegoEnPausa) {
        clearInterval(intervaloObstaculos);
        juegoEnPausa = true;
        window.location.href = 'menu.html'; // Redirige a la página de menú
      }
    }

<script>
  document.addEventListener('DOMContentLoaded', function () {
    const jugador = document.getElementById('jugador');
    const obstaculos = document.querySelectorAll('.obstaculo');
    const salidas = document.querySelectorAll('.salida');
    const habitacion = document.querySelector('.habitacion');
    const vidaBarra = document.getElementById('vidaBarra');
    const botonPausa = document.getElementById('botonPausa');
    let jugadorX, jugadorY, vida;
    const velocidadMovimiento = 2;
    const velocidadPersecucion = 1;
    const velocidadBola = 5;
    let juegoEnPausa = false;
    let intervaloObstaculos;
    let direccionMovimiento = { izquierda: false, derecha: false, arriba: false, abajo: false };
    let bolas = [];

    function iniciarJuego() {
      jugadorX = 20;
      jugadorY = habitacion.offsetHeight - 60;
      vida = 100;
      vidaBarra.style.width = vida + '%';
      jugador.style.left = jugadorX + 'px';
      jugador.style.top = jugadorY + 'px';
      juegoEnPausa = false;
      intervaloObstaculos = setInterval(moverObstaculos, 100);
      animarMovimiento();
    }

    function animarMovimiento() {
      if (direccionMovimiento.izquierda) {
        jugadorX = Math.max(jugadorX - velocidadMovimiento, 0);
      }
      if (direccionMovimiento.derecha) {
        jugadorX = Math.min(jugadorX + velocidadMovimiento, habitacion.offsetWidth - 40);
      }
      if (direccionMovimiento.arriba) {
        jugadorY = Math.max(jugadorY - velocidadMovimiento, 0);
      }
      if (direccionMovimiento.abajo) {
        jugadorY = Math.min(jugadorY + velocidadMovimiento, habitacion.offsetHeight - 40);
      }

      jugador.style.left = jugadorX + 'px';
      jugador.style.top = jugadorY + 'px';

      moverBolas();
      verificarSalida();
      verificarColision();

      if (!juegoEnPausa) {
        requestAnimationFrame(animarMovimiento);
      }
    }

    function verificarSalida() {
      for (const salida of salidas) {
        const salidaRect = salida.getBoundingClientRect();
        const jugadorRect = jugador.getBoundingClientRect();
        if (
          jugadorRect.right >= salidaRect.left &&
          jugadorRect.left <= salidaRect.right &&
          jugadorRect.bottom >= salidaRect.top &&
          jugadorRect.top <= salidaRect.bottom
        ) {
          if (salida.classList.contains('salida-correcta')) {
            alert('¡Felicidades! ¡Has encontrado la salida correcta!');
            window.location.href = 'siguiente-nivel.html'; // Redirige al siguiente nivel
          } else {
            alert('¡Esta no es la salida correcta! Sigue buscando.');
          }
          return;
        }
      }
    }

    function verificarColision() {
      for (const obstaculo of obstaculos) {
        const obstaculoRect = obstaculo.getBoundingClientRect();
        const jugadorRect = jugador.getBoundingClientRect();
        if (
          jugadorRect.right >= obstaculoRect.left &&
          jugadorRect.left <= obstaculoRect.right &&
          jugadorRect.bottom >= obstaculoRect.top &&
          jugadorRect.top <= obstaculoRect.bottom
        ) {
          vida -= 1;
          vidaBarra.style.width = vida + '%';

          if (vida <= 1) {
            alert('¡Game Over!');
            iniciarJuego();
            return;
          }
        }
      }
    }

    function moverObstaculos() {
      for (const obstaculo of obstaculos) {
        const obstaculoX = parseFloat(obstaculo.style.left);
        const obstaculoY = parseFloat(obstaculo.style.top);

        if (obstaculoX < jugadorX) {
          obstaculo.style.left = (obstaculoX + velocidadPersecucion) + 'px';
        } else {
          obstaculo.style.left = (obstaculoX - velocidadPersecucion) + 'px';
        }

        if (obstaculoY < jugadorY) {
          obstaculo.style.top = (obstaculoY + velocidadPersecucion) + 'px';
        } else {
          obstaculo.style.top = (obstaculoY - velocidadPersecucion) + 'px';
        }

        verificarColision();
      }
    }

    function handleKeyDown(event) {
      switch (event.key) {
        case 'ArrowLeft':
          direccionMovimiento.izquierda = true;
          break;
        case 'ArrowRight':
          direccionMovimiento.derecha = true;
          break;
        case 'ArrowUp':
          direccionMovimiento.arriba = true;
          break;
        case 'ArrowDown':
          direccionMovimiento.abajo = true;
          break;
        case ' ':
          lanzarBola();
          break;
      }
    }

    function handleKeyUp(event) {
      switch (event.key) {
        case 'ArrowLeft':
          direccionMovimiento.izquierda = false;
          break;
        case 'ArrowRight':
          direccionMovimiento.derecha = false;
          break;
        case 'ArrowUp':
          direccionMovimiento.arriba = false;
          break;
        case 'ArrowDown':
          direccionMovimiento.abajo = false;
          break;
      }
    }

    function lanzarBola() {
      const bola = document.createElement('div');
      bola.className = 'bola';
      bola.style.left = (jugadorX + 20) + 'px';
      bola.style.top = (jugadorY + 15) + 'px';
      habitacion.appendChild(bola);
      bolas.push(bola);
    }

    function moverBolas() {
      bolas = bolas.filter(bola => {
        let bolaX = parseFloat(bola.style.left);
        bolaX += velocidadBola;
        bola.style.left = bolaX + 'px';

        if (bolaX > habitacion.offsetWidth) {
          habitacion.removeChild(bola);
          return false;
        }
        return true;
      });
    }

    function pausarJuego() {
      if (!juegoEnPausa) {
        clearInterval(intervaloObstaculos);
        juegoEnPausa = true;
        window.location.href = 'menu.html'; // Redirige a la página de menú
      }
    }

    botonPausa.addEventListener('click', pausarJuego);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    iniciarJuego();
  });
</script>



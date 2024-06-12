const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const resetButton = document.getElementById('reset-button');
const jumpSound = document.getElementById('jumpSound');

let isJumping = false;
let playerPosition = 8;
let obstacles = [];
let gameOver = false;
let obstaclesCleared = 0;
const playerSize = 50;
const obstacleSize = 30;
const houseSize = 100;
const gravity = 0.9;

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isJumping && !gameOver) {
        jump();
    }
});

function jump() {
    isJumping = true;
    jumpSound.play(); // Reproducir el sonido de salto
    let jumpCount = 0;
    const jumpInterval = setInterval(() => {
        if (jumpCount < 15) {
            playerPosition += 10;
            player.style.bottom = `${playerPosition}px`;
        } else if (jumpCount >= 15 && jumpCount < 30) {
            playerPosition -= 10;
            player.style.bottom = `${playerPosition}px`;
        } else {
            clearInterval(jumpInterval);
            isJumping = false;
        }
        jumpCount++;
    }, 20);
}

function createObstacle() {
    let obstaclePosition = 800;
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${obstaclePosition}px`;
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);

    const obstacleInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(obstacleInterval);
            return;
        }

        obstaclePosition -= 10;
        obstacle.style.left = `${obstaclePosition}px`;

        if (detectCollision(obstaclePosition)) {
            clearInterval(obstacleInterval);
            endGame('Game Over!');
        }

        if (obstaclePosition < -obstacleSize) {
            clearInterval(obstacleInterval);
            gameContainer.removeChild(obstacle);
            obstacles.shift();
            updateScore();
        }
    }, 20);
}

function detectCollision(obstaclePosition) {
    return obstaclePosition > 0 && obstaclePosition < playerSize && playerPosition < obstacleSize;
}

function updateScore() {
    obstaclesCleared++;
    scoreDisplay.textContent = `Score: ${obstaclesCleared}`;
    if (obstaclesCleared === 10) {
        spawnHouse();
    }
}

function spawnHouse() {
    const house = document.createElement('img');
    house.id = 'house';
    house.src = 'casa1.png'; // Cambia esto por la ruta a tu imagen de la casa
    gameContainer.appendChild(house);

    let housePosition = 800;
    const houseInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(houseInterval);
            return;
        }

        housePosition -= 10;
        house.style.right = `${housePosition}px`;

        if (housePosition <= playerSize && playerPosition < houseSize) {
            clearInterval(houseInterval);
            endGame('¡Ganaste! Has llegado a la casa.');
        }
    }, 20);
}

function endGame(message) {
    gameOver = true;
    alert(message);
    showResetButton();
}

function showResetButton() {
    resetButton.style.display = 'block';
}

function resetGame() {
    // Clear all obstacles
    obstacles.forEach(obstacle => {
        gameContainer.removeChild(obstacle);
    });
    obstacles = [];

    // Remove house if exists
    const house = document.getElementById('house');
    if (house) {
        gameContainer.removeChild(house);
    }

    // Reset variables
    playerPosition = 0;
    player.style.bottom = `${playerPosition}px`;
    obstaclesCleared = 0;
    scoreDisplay.textContent = `Score: ${obstaclesCleared}`;
    gameOver = false;

    // Hide reset button
    resetButton.style.display = 'none';

    // Restart game
    startGame();
}

function startGame() {
    createObstacle();
    const obstacleInterval = setInterval(() => {
        if (!gameOver) {
            createObstacle();
        } else {
            clearInterval(obstacleInterval);
        }
    }, 1000);

    // Generate colored balls
    const ballInterval = setInterval(() => {
        if (!gameOver) {
            createColorBall();
        } else {
            clearInterval(ballInterval);
        }
    }, 500);
}

function createColorBall() {
    const ball = document.createElement('div');
    ball.classList.add('color-ball');
    ball.style.left = `${Math.random() * 100}%`;
    ball.style.backgroundColor = getRandomColor();
    gameContainer.appendChild(ball);

    ball.addEventListener('animationend', () => {
        gameContainer.removeChild(ball);
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

startGame();

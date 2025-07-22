// Benji Bananas Web Clone - Game Engine
// Step 1: Basic Canvas Setup and Game Loop

// Canvas and context setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state variables
let gameRunning = true;
let score = 0;
let bananas = 0;
let lastTime = 0;
let deltaTime = 0;

// Canvas dimensions
let canvasWidth = 800;
let canvasHeight = 600;

// Initialize canvas size
function initCanvas() {
  // Set canvas size based on window size while maintaining aspect ratio
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const aspectRatio = 4/3; // Target aspect ratio
  
  if (windowWidth / windowHeight > aspectRatio) {
    // Window is wider than our aspect ratio
    canvasHeight = windowHeight;
    canvasWidth = windowHeight * aspectRatio;
  } else {
    // Window is taller than our aspect ratio
    canvasWidth = windowWidth;
    canvasHeight = windowWidth / aspectRatio;
  }
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  console.log(`Canvas initialized: ${canvasWidth}x${canvasHeight}`);
}

// Resize event listener for responsive design
function handleResize() {
  initCanvas();
  console.log('Canvas resized for responsive design');
}

// Main game loop
function gameLoop(currentTime) {
  if (!gameRunning) return;
  
  // Calculate delta time for consistent physics
  deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  
  // Clear canvas with jungle-themed background
  ctx.fillStyle = '#90EE90'; // Light green for jungle
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight * 0.3);
  gradient.addColorStop(0, '#87CEEB'); // Sky blue
  gradient.addColorStop(1, '#90EE90'); // Light green
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight * 0.3);
  
  // Draw basic HUD for testing
  drawHUD();
  
  // Performance monitoring
  const fps = Math.round(1000 / deltaTime);
  if (fps < 50) {
    console.warn(`Low FPS detected: ${fps}`);
  }
  
  // Continue game loop
  requestAnimationFrame(gameLoop);
}

// Draw HUD (Head-Up Display)
function drawHUD() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  
  // Score display
  const scoreText = `Score: ${score}`;
  ctx.strokeText(scoreText, 10, 30);
  ctx.fillText(scoreText, 10, 30);
  
  // Banana counter
  const bananaText = `Bananas: ${bananas}`;
  ctx.strokeText(bananaText, 10, 60);
  ctx.fillText(bananaText, 10, 60);
  
  // Game status
  const statusText = 'Step 1: Canvas Setup Complete';
  ctx.strokeText(statusText, 10, canvasHeight - 20);
  ctx.fillText(statusText, 10, canvasHeight - 20);
}

// Initialize game
function initGame() {
  console.log('Benji Bananas Web Clone - Starting...');
  initCanvas();
  
  // Add event listeners
  window.addEventListener('resize', handleResize);
  
  // Start game loop
  requestAnimationFrame(gameLoop);
  
  console.log('Game loop started - Target: 60 FPS');
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);
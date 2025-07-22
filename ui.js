// ui.js - User interface, input handling, and game screens
// Benji Bananas Web Clone - UI Module

// Input state
let isMouseDown = false;
let isKeyDown = false;

// Game state variables (for UI display)
let score = 0;
let bananas = 0;

// Input event handlers
function setupInputHandlers(canvas) {
  // Mouse/Touch controls
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchend', handleTouchEnd);
  
  // Keyboard controls
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  console.log('Input handlers initialized - mouse, touch, and keyboard controls active');
}

// Mouse/Touch event handlers
function handleMouseDown(e) {
  e.preventDefault();
  isMouseDown = true;
  handleGrabInput();
}

function handleMouseUp(e) {
  e.preventDefault();
  isMouseDown = false;
  handleReleaseInput();
}

function handleTouchStart(e) {
  e.preventDefault();
  isMouseDown = true;
  handleGrabInput();
}

function handleTouchEnd(e) {
  e.preventDefault();
  isMouseDown = false;
  handleReleaseInput();
}

// Keyboard event handlers
function handleKeyDown(e) {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!isKeyDown) {
      isKeyDown = true;
      handleGrabInput();
    }
  }
}

function handleKeyUp(e) {
  if (e.code === 'Space') {
    e.preventDefault();
    isKeyDown = false;
    handleReleaseInput();
  }
}

// Handle input for vine grabbing
function handleGrabInput() {
  const nearestVine = findNearestVine(player.x, player.y);
  handleGrabVine(nearestVine);
}

// Handle input for vine releasing
function handleReleaseInput() {
  handleReleaseVine();
}

// Draw HUD (Head-Up Display)
function drawHUD(ctx, canvasHeight) {
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
  
  // Player state info
  const stateText = player.isSwinging ? 'Swinging' : (player.isOnGround ? 'On Ground' : 'Falling');
  ctx.strokeText(`State: ${stateText}`, 10, 90);
  ctx.fillText(`State: ${stateText}`, 10, 90);
  
  // Vine count
  const vineText = `Vines: ${getVineCount()}`;
  ctx.strokeText(vineText, 10, 120);
  ctx.fillText(vineText, 10, 120);
  
  // Controls hint
  ctx.font = '16px Arial';
  const controlText = 'Click/Tap or SPACEBAR to grab vines!';
  ctx.strokeText(controlText, 10, canvasHeight - 50);
  ctx.fillText(controlText, 10, canvasHeight - 50);
  
  // Game status
  ctx.font = '20px Arial';
  const statusText = 'REFACTORED: Modular Architecture';
  ctx.strokeText(statusText, 10, canvasHeight - 20);
  ctx.fillText(statusText, 10, canvasHeight - 20);
}

// Draw game over screen
function drawGameOverScreen(ctx, canvasWidth, canvasHeight) {
  // Game over overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  ctx.fillStyle = 'white';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', canvasWidth / 2, canvasHeight / 2 - 50);
  ctx.font = '24px Arial';
  ctx.fillText('Benji hit the ground!', canvasWidth / 2, canvasHeight / 2);
  ctx.fillText('Refresh to play again', canvasWidth / 2, canvasHeight / 2 + 40);
  ctx.textAlign = 'left'; // Reset text alignment
}

// Update score (called from main game)
function updateScore(newScore) {
  score = newScore;
}

// Update banana count (called from main game)
function updateBananas(newBananas) {
  bananas = newBananas;
}

// Get current score
function getScore() {
  return score;
}

// Get current banana count
function getBananas() {
  return bananas;
}

// Reset UI state (for game restart)
function resetUI() {
  score = 0;
  bananas = 0;
  isMouseDown = false;
  isKeyDown = false;
  console.log('UI state reset - score and bananas cleared');
} 
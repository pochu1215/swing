// world.js - World generation and management
// Benji Bananas Web Clone - World Module

// Vines array for swinging
let vines = [];

// Generate vines procedurally
function generateVines(canvasWidth, canvasHeight) {
  // Keep 5-8 vines on screen at all times
  while (vines.length < 8) {
    const vine = {
      x: (vines.length === 0) ? 200 : (150 + vines.length * 120), // First vine close to Benji
      y: Math.random() * (canvasHeight * 0.4) + 30, // Upper portion of screen
      length: 120 + Math.random() * 100
    };
    vines.push(vine);
  }
  console.log(`Generated vines. Total count: ${vines.length}`);
}

// Update vines (scroll them left)
function updateVines() {
  // Move vines left at a steady pace
  vines.forEach(vine => {
    vine.x -= 2; // Steady scrolling speed
  });
  
  // Remove off-screen vines
  const vinesBefore = vines.length;
  vines = vines.filter(vine => vine.x > -100);
  
  if (vines.length < vinesBefore) {
    console.log(`Removed ${vinesBefore - vines.length} off-screen vines`);
  }
}

// Find nearest vine within grab range
function findNearestVine(px, py) {
  let nearest = null;
  let minDistance = Infinity;
  
  vines.forEach(vine => {
    const dist = distance({x: px, y: py}, vine);
    if (dist < 150 && dist < minDistance) { // 150px grab range (increased)
      nearest = vine;
      minDistance = dist;
    }
  });
  
  return nearest;
}

// Draw vines
function drawVines(ctx, playerX, playerY, playerIsSwinging) {
  vines.forEach(vine => {
    // Draw vine rope
    ctx.beginPath();
    ctx.moveTo(vine.x, vine.y);
    ctx.lineTo(vine.x, vine.y + vine.length);
    ctx.strokeStyle = '#228B22'; // Forest green
    ctx.lineWidth = 8;
    ctx.stroke();
    
    // Draw vine attachment point
    ctx.beginPath();
    ctx.arc(vine.x, vine.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#8B4513'; // Brown
    ctx.fill();
    
    // Highlight nearby vines
    const vineDistance = Math.sqrt((playerX - vine.x) ** 2 + (playerY - vine.y) ** 2);
    if (vineDistance < 150 && !playerIsSwinging) {
      ctx.beginPath();
      ctx.arc(vine.x, vine.y, 40, 0, Math.PI * 2);
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  });
}

// Draw ground
function drawGround(ctx, canvasWidth, canvasHeight) {
  const groundLevel = canvasHeight - 50;
  ctx.fillStyle = '#8B4513'; // Brown ground
  ctx.fillRect(0, groundLevel, canvasWidth, 50);
  
  // Add grass texture
  ctx.fillStyle = '#228B22'; // Green grass
  ctx.fillRect(0, groundLevel, canvasWidth, 10);
}

// Draw background with sky gradient
function drawBackground(ctx, canvasWidth, canvasHeight) {
  // Clear canvas with jungle-themed background
  ctx.fillStyle = '#90EE90'; // Light green for jungle
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight * 0.3);
  gradient.addColorStop(0, '#87CEEB'); // Sky blue
  gradient.addColorStop(1, '#90EE90'); // Light green
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight * 0.3);
}

// Get vine count for debugging
function getVineCount() {
  return vines.length;
}

// Reset world (for game restart)
function resetWorld() {
  vines = [];
  console.log('World reset - all vines cleared');
} 
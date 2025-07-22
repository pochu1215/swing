// physics.js - Player physics and movement calculations
// Benji Bananas Web Clone - Physics Module

// Player (Benji) object
const player = {
  x: 100,
  y: 0, // Will be set in initPlayer
  vx: 3, // Horizontal velocity (reduced for better control)
  vy: -2, // Start with slight upward velocity
  radius: 20, // Simple circle for now
  isSwinging: false,
  swingAnchor: { x: 0, y: 0 },
  swingLength: 0,
  swingAngle: 0,
  swingAngularVelocity: 0,
  isOnGround: false
};

// Initialize player position based on canvas size
function initPlayer(canvasHeight) {
  player.y = canvasHeight / 2;
  console.log(`Player initialized at position: (${player.x}, ${player.y})`);
}

// Update player position when canvas resizes
function updatePlayerPosition(canvasHeight, oldCanvasHeight) {
  if (oldCanvasHeight > 0) {
    const heightRatio = canvasHeight / oldCanvasHeight;
    player.y *= heightRatio;
  }
}

// Update player physics and movement
function updatePlayer(canvasHeight) {
  if (player.isSwinging) {
    // Pendulum physics
    player.swingAngularVelocity += (Math.sin(player.swingAngle) * -0.005); // Gravity effect
    player.swingAngle += player.swingAngularVelocity;
    player.x = player.swingAnchor.x + Math.sin(player.swingAngle) * player.swingLength;
    player.y = player.swingAnchor.y + Math.cos(player.swingAngle) * player.swingLength;
  } else {
    // Freefall physics
    player.vy += 0.5; // Gravity
    player.x += player.vx;
    player.y += player.vy;
    
    // Ground collision detection
    const groundLevel = canvasHeight - 50; // Leave space at bottom for ground
    if (player.y + player.radius > groundLevel) {
      player.y = groundLevel - player.radius;
      player.vy = 0;
      player.isOnGround = true;
      return 'gameOver'; // Signal game over
    } else {
      player.isOnGround = false;
    }
    
    // Keep player on screen horizontally
    if (player.x < player.radius) {
      player.x = player.radius;
      player.vx = Math.abs(player.vx); // Bounce off left edge
    }
  }
  
  // Log player position for debugging
  if (Math.random() < 0.01) { // Log occasionally to avoid spam
    console.log(`Player position: (${Math.round(player.x)}, ${Math.round(player.y)}), velocity: (${Math.round(player.vx)}, ${Math.round(player.vy)}), state: ${player.isSwinging ? 'swinging' : (player.isOnGround ? 'ground' : 'falling')}`);
  }
  
  return 'continue';
}

// Handle vine grabbing input
function handleGrabVine(nearestVine) {
  if (!player.isSwinging && !player.isOnGround && nearestVine) {
    player.isSwinging = true;
    player.swingAnchor = { x: nearestVine.x, y: nearestVine.y };
    player.swingLength = distance(player, nearestVine);
    player.swingAngle = Math.atan2(player.x - nearestVine.x, player.y - nearestVine.y);
    player.swingAngularVelocity = player.vx / player.swingLength; // Convert horizontal momentum
    
    console.log('Benji grabbed a vine!');
    return true;
  }
  return false;
}

// Handle vine releasing input
function handleReleaseVine() {
  if (player.isSwinging) {
    player.isSwinging = false;
    // Convert swing momentum back to velocity
    player.vx = Math.sin(player.swingAngle) * player.swingLength * player.swingAngularVelocity * 0.8;
    player.vy = Math.cos(player.swingAngle) * player.swingLength * player.swingAngularVelocity * 0.8;
    
    console.log('Benji released the vine!');
    return true;
  }
  return false;
}

// Distance calculation helper
function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Draw player (Benji)
function drawPlayer(ctx) {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  
  // Color based on state
  if (player.isSwinging) {
    ctx.fillStyle = '#8B4513'; // Dark brown when swinging
  } else if (player.isOnGround) {
    ctx.fillStyle = '#CD853F'; // Lighter brown when on ground
  } else {
    ctx.fillStyle = '#A0522D'; // Medium brown when falling
  }
  
  ctx.fill();
  
  // Add simple face
  ctx.fillStyle = 'black';
  // Eyes
  ctx.beginPath();
  ctx.arc(player.x - 6, player.y - 5, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(player.x + 6, player.y - 5, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Smile
  ctx.beginPath();
  ctx.arc(player.x, player.y + 3, 8, 0, Math.PI);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Draw swing rope when player is swinging
function drawSwingRope(ctx) {
  if (player.isSwinging) {
    ctx.beginPath();
    ctx.moveTo(player.swingAnchor.x, player.swingAnchor.y);
    ctx.lineTo(player.x, player.y);
    ctx.strokeStyle = '#8B4513'; // Brown rope
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Highlight the anchor point
    ctx.beginPath();
    ctx.arc(player.swingAnchor.x, player.swingAnchor.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
  }
} 
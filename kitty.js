const kitties = document.querySelectorAll('.kitty');
const kittyTargets = [];

// Load sounds once
const meows = [
  new Audio('meow1.mp3'),
  new Audio('meow2.mp3')
];
let lastMeow = 0;

// Initialize starting positions
kitties.forEach(kitty => {
  kittyTargets.push({ 
    x: kitty.offsetLeft,
    y: kitty.offsetTop
  });
});

// Track mouse movement
document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  kitties.forEach((kitty, i) => {
    const rect = kitty.getBoundingClientRect();
    const kittyCenterX = rect.left + rect.width / 2;
    const kittyCenterY = rect.top + rect.height / 2;

    const dx = mouseX - kittyCenterX;
    const dy = mouseY - kittyCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 120) {
      const angle = Math.atan2(dy, dx);
      const moveX = Math.cos(angle) * -80;
      const moveY = Math.sin(angle) * -80;

      let newX = kitty.offsetLeft + moveX;
      let newY = kitty.offsetTop + moveY;

      // Play meow with cooldown
      if (Date.now() - lastMeow > 500) {
        meows[Math.floor(Math.random() * meows.length)].play();
        lastMeow = Date.now();
      }

      // Keep inside screen
      newX = Math.max(0, Math.min(window.innerWidth - rect.width, newX));
      newY = Math.max(0, Math.min(window.innerHeight - rect.height, newY));

      kittyTargets[i].x = newX;
      kittyTargets[i].y = newY;
    }
  });
});

// Smooth movement + rotation
function animate() {
  kitties.forEach((kitty, i) => {
    const currentX = kitty.offsetLeft;
    const currentY = kitty.offsetTop;
    const targetX = kittyTargets[i].x;
    const targetY = kittyTargets[i].y;

    const angle = Math.atan2(targetY - currentY, targetX - currentX);
    kitty.style.transform = `rotate(${angle * 20 / Math.PI}deg)`;

    kitty.style.left = currentX + (targetX - currentX) * 0.1 + 'px';
    kitty.style.top  = currentY + (targetY - currentY) * 0.1 + 'px';
  });

  requestAnimationFrame(animate);
}
animate();

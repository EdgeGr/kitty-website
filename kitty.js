const kitties = document.querySelectorAll('.kitty');
const kittyTargets = [];
const meows = [
  new Audio('meow1.mp3'),
  new Audio('meow2.mp3')
];
let lastMeow = 0;

function setRandomPositions() {
  kitties.forEach(kitty => {
    kitty.style.position = 'absolute';

    const maxX = window.innerWidth - kitty.width;
    const maxY = window.innerHeight - kitty.height;

    const startX = Math.random() * maxX;
    const startY = Math.random() * maxY;

    kitty.style.left = startX + 'px';
    kitty.style.top = startY + 'px';

    kittyTargets.push({ x: startX, y: startY });
  });
}

// Wait for all images to load
let loadedCount = 0;
kitties.forEach(kitty => {
  if (kitty.complete) {
    loadedCount++;
    if (loadedCount === kitties.length) setRandomPositions();
  } else {
    kitty.addEventListener('load', () => {
      loadedCount++;
      if (loadedCount === kitties.length) setRandomPositions();
    });
  }
});

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

      if (Date.now() - lastMeow > 500) {
        meows[Math.floor(Math.random() * meows.length)].play();
        lastMeow = Date.now();
      }

      newX = Math.max(0, Math.min(window.innerWidth - rect.width, newX));
      newY = Math.max(0, Math.min(window.innerHeight - rect.height, newY));

      kittyTargets[i].x = newX;
      kittyTargets[i].y = newY;
    }
  });
});

function animate() {
  kitties.forEach((kitty, i) => {
    const currentX = kitty.offsetLeft;
    const currentY = kitty.offsetTop;
    const targetX = kittyTargets[i]?.x ?? currentX;
    const targetY = kittyTargets[i]?.y ?? currentY;

    const angle = Math.atan2(targetY - currentY, targetX - currentX);
    kitty.style.transform = `rotate(${angle * 20 / Math.PI}deg)`;

    kitty.style.left = currentX + (targetX - currentX) * 0.1 + 'px';
    kitty.style.top = currentY + (targetY - currentY) * 0.1 + 'px';
  });

  requestAnimationFrame(animate);
}
animate();

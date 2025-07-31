function setupMouthPath() {
  const buttons = document.querySelectorAll('.mood-btn');
  const mouthPath = document.getElementById('mouthPath');

  const mouthShapes = {
    "1": "M9 23C26.5 13 46.5 13 67 23",  
    "2": "M9 17C26.5 17 46.5 17 67 17",  
    "3": "M9 13C26.5 19 46.5 19 67 13",
    "4": "M9 9C26.5 23 46.5 23 67 9",
  };

  buttons.forEach(btn => btn.replaceWith(btn.cloneNode(true)));
  const fresh = document.querySelectorAll('.mood-btn');

  fresh.forEach(btn => {
    btn.addEventListener('click', () => {
      fresh.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const m = btn.dataset.mood;
      if (mouthShapes[m]) mouthPath.setAttribute('d', mouthShapes[m]);
    });
    btn.addEventListener('mouseenter', () => {
      const m = btn.dataset.mood;
      if (mouthShapes[m]) mouthPath.setAttribute('d', mouthShapes[m]);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupMouthPath);
} else {
  setupMouthPath();
}
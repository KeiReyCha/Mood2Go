
function setupVibeButtons() {
  const buttons = document.querySelectorAll('.vibe-btn');
  if (!buttons.length) return;

  buttons.forEach(btn => btn.replaceWith(btn.cloneNode(true)));
  const fresh = document.querySelectorAll('.vibe-btn');

  fresh.forEach(btn => {
    btn.addEventListener('click', () => {
      fresh.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const vibe = btn.dataset.vibe;
      localStorage.setItem("selectedVibe", vibe);
    });
  });
}

document.addEventListener('DOMContentLoaded', setupVibeButtons);
document.addEventListener("pageUpdated", setupVibeButtons);

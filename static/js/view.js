
function setupEyes() {
  document.addEventListener("mousemove", (e) => {
    if (document.querySelector('.pagetwo')) return;
    document.querySelectorAll(".Mata").forEach((eye) => {
      const pupil = eye.querySelector(".Pupil");
      if (!pupil) return;

      const rect = eye.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      const eyeballR = Math.min(rect.width, rect.height) / 2;
      const pupilR   = pupil.offsetWidth / 2;
      const maxOff   = eyeballR - pupilR;

      const angle = Math.atan2(dy, dx);
      const limited = Math.min(dist, maxOff);

      const x = limited * Math.cos(angle);
      const y = limited * Math.sin(angle);

      pupil.style.transform =
        `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    });
  });
}

if (document.readyState !== "loading") {
  setupEyes();
} else {
  document.addEventListener("DOMContentLoaded", setupEyes);
}

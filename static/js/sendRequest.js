function setupGenerateRequest() {
  if (!document.querySelector('.page4')) return;

  const generateBtn = document.querySelector(".GenerateButton");
  if (!generateBtn) return;

  generateBtn.onclick = null;

  generateBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const page4 = document.querySelector('.page4');
    page4.classList.add('character-out');
    setTimeout(() => {
      page4.classList.add('expanding');
      localStorage.removeItem('recommendations');

      const mood = localStorage.getItem('selectedMood') || 'happy';
      const vibe = localStorage.getItem('selectedVibe') || 'cozy';
      const radius = localStorage.getItem('selectedRadius') || 2;
      const location = JSON.parse(localStorage.getItem('selectedLocation')) || { lat: 52.3770980, lng: -1.5652983 };

      fetch('/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, vibe, radius, location }),
        cache: 'no-store'
      })
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        localStorage.setItem('recommendations', JSON.stringify(data));
        loadPage('page5.html');
      })
      .catch(err => {
        console.error(err);
      });

    }, 900);
  });
}

document.addEventListener("DOMContentLoaded", setupGenerateRequest);
document.addEventListener("pageUpdated", setupGenerateRequest);

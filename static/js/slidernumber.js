function setupSliderNumber() {
  const slider = document.getElementById('distanceSlider');
  const output = document.getElementById('distanceLabel');
  const generateBtn = document.querySelector(".Button");

  if (!slider || !output) return;

  const saved = localStorage.getItem('selectedRadius');
  if (saved) {
    slider.value = saved;
    output.textContent = saved;
  } else {
    output.textContent = slider.value;
  }

  slider.addEventListener('input', () => {
    output.textContent = slider.value;
    localStorage.setItem('selectedRadius', slider.value);
  });

  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      const km = parseInt(slider.value);
      localStorage.setItem("selectedRadius", km);
    });
  }
}

document.addEventListener('DOMContentLoaded', setupSliderNumber);
document.addEventListener('pageUpdated', setupSliderNumber);

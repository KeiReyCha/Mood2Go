function waitForAnimationEnd(el) {
  return new Promise(resolve => {
    function onEnd(e) {
      if (e.target === el) {
        el.removeEventListener('animationend', onEnd);
        resolve();
      }
    }
    el.addEventListener('animationend', onEnd);
  });
}

async function loadPage(url) {
  const container = document.getElementById('dynamicContent');

  container.classList.add('page-out');
  await waitForAnimationEnd(container);

  container.classList.remove('page-out', 'visible');
  container.innerHTML = '';

  const path = url.endsWith('.html')
    ? `/pages/${url}`
    : url.startsWith('/')
      ? url
      : `/static/${url}`;
  await fetchAndInsert(path, container);
  container.classList.add('page-in', 'visible');
}
function unloadOldCSS() {
  document.querySelectorAll('link[data-page-css]').forEach(l => l.remove());
}

function loadPageCss(path) {
  const file = path.split("/").pop();
  const cssMap = {
    "page2.html": "/static/css/pagetwo.css",
    "page3.html": "/static/css/pagethree.css",
    "page4.html": "/static/css/pagefour.css",
    "page5.html": "/static/css/pagefive.css",
    "page6.html": "/static/css/pagesix.css",
    "page7.html": "/static/css/pageseven.css",
  };
  const href = cssMap[file];
  if (!href) return null;

  unloadOldCSS();
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute("data-page-css", "");

  return new Promise(res => {
    link.onload = () => res();
    link.onerror = () => {
      console.warn("CSS failed to load:", href);
      res();
    };
    document.head.appendChild(link);
  });
}

async function fetchAndInsert(path, container) {
  container.classList.remove("visible");
  const cssPromise = loadPageCss(path);
  const res  = await fetch(path);
  const html = await res.text();
  const temp = document.createElement("div");
  temp.innerHTML = html.trim();
  const newPage = temp.firstElementChild;

  container.innerHTML = "";
  container.appendChild(newPage);

  if (cssPromise) await cssPromise;

  const file = path.split("/").pop();
  document.body.setAttribute('data-page', file);
  if      (file === "page4.html")      initializePage4();
  else if (file === "page5.html")      await initializePage5();
  else if (file === "page6.html")      initializePage6();
  else if (file === "page7.html")      initializePage7();
  
  container.classList.remove('page-in');
  container.classList.add("visible");
  document.dispatchEvent(new Event("pageUpdated"));
}

document.body.addEventListener("click", e => {
  const link = e.target.closest("[data-link]");
  if (!link) return;
  e.preventDefault();
  loadPage(link.getAttribute("data-link"));
});


function initializePage4() {
  setupMoodButtons();
  setupMouthPath();
  setupVibeButtons();
  setupSliderNumber();
  initMap();

  const slider = document.getElementById('distanceSlider');
  const label = document.getElementById('distanceLabel');
  if (slider && label) {
    slider.addEventListener('input', () => {
      const km = parseInt(slider.value, 10);
      label.textContent = km;

      const zoom =
        km <= 0.5 ? 15 :
        km <= 1 ? 14 :
        km <= 1.5 ? 14.5 :
        km <= 2 ? 13 :
        km <= 2.5 ? 13.5 :
        km <= 3 ? 12.4 :
        km <= 4 ? 12 :
        km <= 5 ? 11.5 :
        km <= 6 ? 11.3 :
        km <= 7 ? 11.2 :
        km <= 8 ? 11 :
        km <= 9 ? 10.8 :
        km <= 10 ? 10.7 : 10;
      map.setZoom(zoom);
      localStorage.setItem('LastZoom', JSON.stringify(zoom));
    });
    slider.dispatchEvent(new Event('input'));
  }
}


async function initializePage5() {
  const LastZoom = Number(localStorage.getItem('LastZoom')) || 14;
  const userloc  = JSON.parse(localStorage.getItem('selectedLocation')) || { lat: 52.3770980, lng: -1.5652983 };
  const recs     = JSON.parse(localStorage.getItem('recommendations')) || [];

  await initializeMap5(LastZoom, userloc, recs);

  const flood = document.querySelector('.page5 .flood-box');
  if (flood) {
    flood.getBoundingClientRect();
    flood.classList.add('slid');
  }
}

function initializePage6() {
  const userloc = JSON.parse(localStorage.getItem('selectedLocation')) || { lat: 52.3770980, lng: -1.5652983 };
  const destination = JSON.parse(localStorage.getItem('directions_destination'));
  const destinationName = localStorage.getItem('destination_name');
  initializeMap6(userloc, destinationName, destination);
  setupExpandBox();
}

function initializePage7() {
  setupEyes();
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("dynamicContent").classList.add("visible");
});
let map;
let map5;

function initMap() {
    let center = { lat:51.509865, lng:-0.118092}; 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                initializeMap(center);
            },
            (error) => {
                console.warn('Geolocation failed or denied, using default location.', error);
                initializeMap(center);
            }
        );
    } else {
        initializeMap(center);
    }
}


function initializeMap(center) {
   
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: center,
        disableDefaultUI: true,
        draggable: false,
        scrollwheel: false,
    });

    new google.maps.Marker({
        position: center,
        map: map,
        icon: {
            url : "/static/markers/user-marker.svg",
            scaledSize: new google.maps.Size(50, 50) 
        }
    });

    map.addListener('zoom_changed', function() {
    });

        
    localStorage.setItem("selectedLocation", JSON.stringify(center));
}


//punya page 5
function initializeMap5(LastZoom, userloc, recommendations) {
    return new Promise(resolve => {
    map5 = new google.maps.Map(document.getElementById("map5"), {
      zoom: LastZoom,
      center: userloc,
      disableDefaultUI: true,
      draggable: true,
      scrollwheel: true,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      gestureHandling: "auto"
    });

    new google.maps.Marker({
      position: userloc,
      map: map5,
      icon: {
        url: "/static/markers/user-marker.svg",
        scaledSize: new google.maps.Size(50, 50)
      }
    });

    recommendations.forEach((place, i) => {
      const iconUrl = i === 0
        ? "/static/markers/marker-a.svg"
        : i === 1
          ? "/static/markers/marker-b.svg"
          : "/static/markers/marker-c.svg";

      const marker = new google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: map5,
        title: `${place.name}${place.rating ? ` (${place.rating})` : ""}`,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(30, 30)
        }
      });

      const infoContent = `
        <div class="custom-infowindow-bg">
          <div class="custom-infowindow">
            <span class="place-name">${place.name}</span><br>
            <span class="label">Rating:</span> <span class="rating">${place.rating || 'N/A'}</span><br>
            <span class="label">Reason:</span> <span class="reason">${place.reason || 'N/A'}</span>
            <button class="go-btn" id="go-btn-${i}" data-lat="${place.lat}" data-lng="${place.lng}" aria-label="Go">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="white"/>
              </svg>
            </button>
          </div>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({ content: infoContent });
      marker.addListener('click', () => {
        infoWindow.open(map5, marker);
        google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
          const btn = document.getElementById(`go-btn-${i}`);
          if (btn) {
            btn.setAttribute('data-link', 'page6.html');
            btn.onclick = e => {
              e.preventDefault();
              localStorage.setItem("directions_destination", JSON.stringify({ lat: place.lat, lng: place.lng }));
              localStorage.setItem("destination_name", place.name);
              localStorage.setItem("directions_origin", JSON.stringify(userloc));
              if (typeof loadPage === 'function') loadPage('page6.html');
              else window.location.href = "page6.html";
            };
          }
        });
      });
    });

    // resolve only once everything (tiles+markers) is rendered
    google.maps.event.addListenerOnce(map5, 'idle', () => {
      resolve();
    });
  });
}



//punya page 6
function initializeMap6(userloc,destinationName,destination) {
    const map6 = new google.maps.Map(document.getElementById("map6"), {
        zoom: 15,
        center: userloc,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({ 
        map: map6,
        suppressInfoWindows: true, 
        suppressMarkers: true 
    });

    const userMarker = new google.maps.Marker({
        position: userloc,
        map: map6,
        icon: {
            url: "/static/markers/user-page6.svg",
            scaledSize: new google.maps.Size(20, 20)
        }
    });

    const destinationMarker = new google.maps.Marker({
        position: destination,
        map: map6,
        icon: {
            url: "/static/markers/user-marker.svg",
            scaledSize: new google.maps.Size(30, 30)
        }
    });

    directionsService.route(
        {
            origin: userloc,
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING,
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);

                const leg = response.routes[0].legs[0];
                document.getElementById("place-name").textContent = destinationName;
                document.getElementById("eta").textContent = leg.duration.text;
                
                const distanceInMeters = leg.distance.value;
                const distanceInKm = (distanceInMeters / 1000).toFixed(1);
                document.getElementById("distance").textContent = `${distanceInKm} km`;

                const steps = leg.steps.map(
                    (step, i) => `<div>${i + 1}. ${step.instructions.replace(/<[^>]+>/g, '')}</div>`
                ).join("");
                document.getElementById("steps").innerHTML = steps;
            }
        }
    );
}
window.initMap = initMap;
window.initializeMap = initializeMap;
window.initializeMap5 = initializeMap5;
window.initializeMap6 = initializeMap6; 


function setupMoodButtons() {
  const swipeContainer = document.getElementById('swipeContainer');
  const face = document.getElementById('face');
  const moodText = document.getElementById('moodText');
  const emotionButton = document.getElementById('emotionButton');
  if (!swipeContainer || !face || !moodText || !emotionButton) return;

  const colors = ['blue', 'green', 'yellow', 'red'];
  const colorValues = {
    blue: '#517FBB',
    green: '#6FB74B',
    yellow: '#FFCD00',
    red: '#F95738'
  };
  const colorToEmotion = {
    blue: 'sad',
    green: 'bored',
    yellow: 'happy',    
    red: 'angry'
  };
  const moodTexts = {
    sad: 'Imagine your heart is a melted ice cream cone, needing some time to reshape itself.',
    bored: 'Your brain is a sloth watching paint dry while waiting for the WiFi to load... yawn-tastic!',
    happy: 'Your heart is throwing a glitter-filled dance party just because it can!',
    angry: 'Picture yourself as a dragon and someone just stepped on your emotional tail!'
  };
   const emotionNames = {
    sad: 'Sad',
    bored: 'Bored',
    happy: 'Happy',
    angry: 'Angry'
  };

  const emotionMouths = {
    sad: "M9 63C26.5 57 46.5 57 67 63",
    bored: "M9 38C26.5 38 46.5 38 67 38",
    happy: "M9 13C26.5 30 46.5 30 67 13",
    angry: "M9 63C26.5 57 46.5 57 67 63"
  };

  let currentIndex = 0;
  
  function updateFace() {
    const color = colors[currentIndex];
    const emotion = colorToEmotion[color];

    swipeContainer.style.backgroundColor = colorValues[color];
    moodText.textContent = moodTexts[emotion];
    emotionButton.textContent = emotionNames[emotion];

    face.className = 'face ' + emotion;

    const path = document.querySelector('.mouth-path');
    
    path.setAttribute('d', emotionMouths[emotion]);

    const mouthContainer = document.querySelector('.mouth-container');
    if (emotion === 'sad' || emotion === 'angry') {
      mouthContainer.style.top = '50%';
    } else if (emotion === 'happy') {
      mouthContainer.style.top = '60%';
    } else {
      mouthContainer.style.top = '55%';
    }

    localStorage.setItem('selectedMood', emotion);
  }
  function nextColor() {
    currentIndex = (currentIndex + 1) % colors.length;
    updateFace();
    animateSwipe('left');
  }
  
  function prevColor() {
    currentIndex = (currentIndex - 1 + colors.length) % colors.length;
    updateFace();
    animateSwipe('right');
  }

  function animateSwipe(direction) {
    swipeContainer.style.transition = 'none';
    
    if (direction === 'left') {
      swipeContainer.style.transform = 'translateX(20px)';
    } else {
      swipeContainer.style.transform = 'translateX(-20px)';
    }
    
    setTimeout(() => {
      swipeContainer.style.transition = 'transform 0.3s ease, background-color 0.4s ease';
      swipeContainer.style.transform = 'translateX(0)';
    }, 10);
  }
  
  
  // mobile
  let startX = 0;
  let endX = 0;
  
  swipeContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  
  swipeContainer.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
  });
  
  swipeContainer.addEventListener('touchend', () => {
    handleSwipe();
  });
  
  // desktop
  swipeContainer.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    swipeContainer.addEventListener('mousemove', mouseMoveHandler);
    swipeContainer.addEventListener('mouseup', mouseUpHandler);
    swipeContainer.addEventListener('mouseleave', mouseUpHandler);
  });
  
  function mouseMoveHandler(e) {
    endX = e.clientX;
  }
  
  function mouseUpHandler() {
    handleSwipe();
    swipeContainer.removeEventListener('mousemove', mouseMoveHandler);
    swipeContainer.removeEventListener('mouseup', mouseUpHandler);
    swipeContainer.removeEventListener('mouseleave', mouseUpHandler);
  }
  
  // swipe direction
  function handleSwipe() {
    const threshold = 50;
    const diff = endX - startX;
    
    if (Math.abs(diff) > threshold) {
      if (diff < 0) {
        nextColor();
      } else {
        prevColor();
      }
    }
    
    startX = 0;
    endX = 0;
  }
  
  // keyboard 
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevColor();
    } else if (e.key === 'ArrowRight') {
      nextColor();
    }
  });

  updateFace();

  emotionButton.onclick = () => {
    loadPage('page3.html');
  };
}

if (document.readyState !== "loading") {
  setupMoodButtons();
} else {
  document.addEventListener('DOMContentLoaded', setupMoodButtons);
}

document.addEventListener('pageUpdated', () => {
  if (document.querySelector('.pagetwo')) {
    setupMoodButtons();
  }
});
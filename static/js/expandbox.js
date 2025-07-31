function setupExpandBox() {
    const box = document.getElementById('bigbox');
    if (!box) return;
    let isExpanded = false;
  
    box.onclick = function() {
      isExpanded = !isExpanded;
      if (isExpanded) {
        box.classList.add('expanded');
      } else {
        box.classList.remove('expanded');
      }
    };
  }
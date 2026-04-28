document.addEventListener("DOMContentLoaded", () => {
  const shapeEl = document.getElementById('playground-shape');
  const cssOutput = document.getElementById('css-output');
  
  let currentShape = 'square';
  let currentColor = '#7b2cbf';
  let currentRotate = 0;
  let currentScale = 1;
  let currentBorderRadius = 0;
  let currentWidth = 120;
  let currentHeight = 120;

  window.setShape = function(type, btn) {
    document.querySelectorAll('.btn-grid .btn.shape-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    currentShape = type;
    
    // Apply shape presets so users start with a good looking standard shape
    if (type === 'square') {
      setWidth(120, true); setHeight(120, true); setBorderRadius(0, true);
    } else if (type === 'circle') {
      setWidth(120, true); setHeight(120, true); setBorderRadius(50, true);
    } else if (type === 'rectangle') {
      setWidth(180, true); setHeight(100, true); setBorderRadius(0, true);
    } else if (type === 'oval') {
      setWidth(180, true); setHeight(100, true); setBorderRadius(50, true);
    } else {
       // Polygon shapes usually look best starting out square
       setWidth(120, true); setHeight(120, true); setBorderRadius(0, true);
       if (type === 'parallelogram') setWidth(160, true);
    }

    shapeEl.className = 'active-shape shape-' + type;
    updateCode();
  };

  window.setColor = function(color) {
    currentColor = color;
    document.documentElement.style.setProperty('--playground-color', color);
    updateCode();
  };

  window.setRotate = function(val) {
    currentRotate = val;
    document.documentElement.style.setProperty('--shape-rotation', val + 'deg');
    updateCode();
  };

  window.setScale = function(val) {
    currentScale = val;
    document.documentElement.style.setProperty('--shape-scale', val);
    updateCode();
  };

  window.setBorderRadius = function(val, updateUI = false) {
    currentBorderRadius = val;
    document.documentElement.style.setProperty('--shape-border-radius', val + '%');
    if (updateUI) document.getElementById('br-slider').value = val;
    updateCode();
  };

  window.setWidth = function(val, updateUI = false) {
    currentWidth = val;
    document.documentElement.style.setProperty('--shape-width', val + 'px');
    if (updateUI) document.getElementById('width-slider').value = val;
    updateCode();
  };

  window.setHeight = function(val, updateUI = false) {
    currentHeight = val;
    document.documentElement.style.setProperty('--shape-height', val + 'px');
    if (updateUI) document.getElementById('height-slider').value = val;
    updateCode();
  };

  function updateCode() {
    let css = `.my-shape {<br>`;
    css += `&nbsp;&nbsp;background: ${currentColor};<br>`;
    css += `&nbsp;&nbsp;width: ${currentWidth}px;<br>`;
    css += `&nbsp;&nbsp;height: ${currentHeight}px;<br>`;
    
    if (currentBorderRadius > 0) {
      css += `&nbsp;&nbsp;border-radius: ${currentBorderRadius}%;<br>`;
    }
    
    const clipPaths = {
      triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      parallelogram: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
      pentagon: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
      hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
    };
    
    if (clipPaths[currentShape]) {
      css += `&nbsp;&nbsp;clip-path: ${clipPaths[currentShape]};<br>`;
    }
    
    let transformStr = [];
    if (currentRotate !== 0 && currentRotate !== "0") transformStr.push(`rotate(${currentRotate}deg)`);
    if (currentScale !== 1 && currentScale !== "1") transformStr.push(`scale(${currentScale})`);
    
    if (transformStr.length > 0) {
      css += `&nbsp;&nbsp;transform: ${transformStr.join(' ')};<br>`;
    }
    
    css += `}`;
    cssOutput.innerHTML = css;
  }
});

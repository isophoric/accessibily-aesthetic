import { formatHex, wcagContrast } from 'https://cdn.jsdelivr.net/npm/culori@3.3.0/+esm';

const hueInput = document.getElementById('input-hue');
const chromaInput = document.getElementById('input-chroma');
const valHue = document.getElementById('val-hue');
const valChroma = document.getElementById('val-chroma');
const modeBtn = document.getElementById('mode-toggle');
const cssCodeBlock = document.getElementById('css-code');
const contrastBadge = document.getElementById('contrast-badge');

let isDark = false;

function updatePalette() {
    const h = parseFloat(hueInput.value);
    const c = parseFloat(chromaInput.value);

    // Update UI numbers
    valHue.innerText = h;
    valChroma.innerText = c;

    // Define Lightness
    const bgL = isDark ? 0.15 : 0.98;
    const textL = isDark ? 0.98 : 0.10;
    const accentL = isDark ? 0.70 : 0.55;

    // Generate Hex
    const bgHex = formatHex({ mode: 'oklch', l: bgL, c: 0.01, h: h });
    const textHex = formatHex({ mode: 'oklch', l: textL, c: 0.02, h: h });
    const accentHex = formatHex({ mode: 'oklch', l: accentL, c: c, h: h });

    // Apply CSS Variables
    document.documentElement.style.setProperty('--bg', bgHex);
    document.documentElement.style.setProperty('--text', textHex);
    document.documentElement.style.setProperty('--accent', accentHex);

    // Update Text
    document.getElementById('hex-bg').innerText = bgHex;
    document.getElementById('hex-text').innerText = textHex;
    document.getElementById('hex-accent').innerText = accentHex;

    // Update Code Block
    cssCodeBlock.innerText = `:root {
  --bg: ${bgHex};
  --text: ${textHex};
  --accent: ${accentHex};
}`;

    // Contrast Check
    const contrast = wcagContrast(accentHex, bgHex);
    
    if (contrast >= 4.5) {
        contrastBadge.innerText = `Pass (${contrast.toFixed(2)})`;
        contrastBadge.style.background = isDark ? '#4ade80' : '#16a34a';
        contrastBadge.style.color = isDark ? '#000' : '#fff';
    } else if (contrast >= 3.0) {
        contrastBadge.innerText = `Large Text (${contrast.toFixed(2)})`;
        contrastBadge.style.background = '#facc15';
        contrastBadge.style.color = '#000';
    } else {
        contrastBadge.innerText = `Fail (${contrast.toFixed(2)})`;
        contrastBadge.style.background = '#ef4444';
        contrastBadge.style.color = '#fff';
    }
}

hueInput.addEventListener('input', updatePalette);
chromaInput.addEventListener('input', updatePalette);

modeBtn.addEventListener('click', () => {
    isDark = !isDark;
    modeBtn.innerText = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    updatePalette();
});

// Init
updatePalette();

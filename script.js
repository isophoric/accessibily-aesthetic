// Import Culori directly from a reliable ESM CDN
import { formatHex, wcagContrast, converter } from 'https://cdn.jsdelivr.net/npm/culori@3.3.0/+esm';

// Grab elements
const hueInput = document.getElementById('input-hue');
const chromaInput = document.getElementById('input-chroma');
const valHue = document.getElementById('val-hue');
const valChroma = document.getElementById('val-chroma');
const modeBtn = document.getElementById('mode-toggle');
const cssCodeBlock = document.getElementById('css-code');
const contrastBadge = document.getElementById('contrast-badge');

let isDark = false;

// Create an OKLCH converter
const toOklch = converter('oklch');

function updatePalette() {
    // 1. Get Values
    const h = parseFloat(hueInput.value);
    const c = parseFloat(chromaInput.value);

    // 2. Update UI Numbers
    valHue.innerText = h;
    valChroma.innerText = c;

    // 3. Define Lightness based on Mode
    // OKLCH Lightness: 0 (black) to 1 (white)
    const bgL = isDark ? 0.15 : 0.98;
    const textL = isDark ? 0.98 : 0.10;
    const accentL = isDark ? 0.70 : 0.55;

    // 4. Generate Hex Colors using Culori
    // We keep chroma low (0.02) for bg/text to keep them neutral but tinted
    const bgHex = formatHex({ mode: 'oklch', l: bgL, c: 0.01, h: h });
    const textHex = formatHex({ mode: 'oklch', l: textL, c: 0.02, h: h });
    const accentHex = formatHex({ mode: 'oklch', l: accentL, c: c, h: h });

    // 5. Apply to CSS Variables
    document.documentElement.style.setProperty('--bg', bgHex);
    document.documentElement.style.setProperty('--text', textHex);
    document.documentElement.style.setProperty('--accent', accentHex);

    // 6. Update Hex Labels
    document.getElementById('hex-bg').innerText = bgHex;
    document.getElementById('hex-text').innerText = textHex;
    document.getElementById('hex-accent').innerText = accentHex;

    // 7. Update Code Block Text (This was missing before!)
    cssCodeBlock.innerText = `:root {
  --bg: ${bgHex};
  --text: ${textHex};
  --accent: ${accentHex};
}`;

    // 8. Calculate Contrast (Accessibility Check)
    // We check the contrast between the Accent color and the Background
    // (Since the accent is used as a block background in the stats row)
    const contrast = wcagContrast(accentHex, bgHex);
    
    // Update Badge
    if (contrast >= 4.5) {
        contrastBadge.innerText = `Pass (${contrast.toFixed(2)})`;
        contrastBadge.style.background = isDark ? '#4ade80' : '#16a34a'; // Green
        contrastBadge.style.color = isDark ? '#000' : '#fff';
    } else if (contrast >= 3.0) {
        contrastBadge.innerText = `Large Text Only (${contrast.toFixed(2)})`;
        contrastBadge.style.background = '#facc15'; // Yellow
        contrastBadge.style.color = '#000';
    } else {
        contrastBadge.innerText = `Fail (${contrast.toFixed(2)})`;
        contrastBadge.style.background = '#ef4444'; // Red
        contrastBadge.style.color = '#fff';
    }
}

// Event Listeners
hueInput.addEventListener('input', updatePalette);
chromaInput.addEventListener('input', updatePalette);

modeBtn.addEventListener('click', () => {
    isDark = !isDark;
    modeBtn.innerText = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    updatePalette();
});

// Run once on load
updatePalette();

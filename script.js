//grab all elements
const hueInput = document.getElementById('input-hue');
const chromaInput = document.getElementById('input-chroma');
const valHue = document.getElementById('val-hue');
const valChroma = document.getElementById('val-chroma');
const modeBtn = document.getElementById('mode-toggle');

let isDark = false;

function updatePalette() {
    console.log("--- updatePalette triggered ---");

    //check if culori is here
    if (typeof culori === 'undefined') {
        console.error("error: culori library not found!");
        return;
    }

    const h = parseFloat(hueInput.value);
    const c = parseFloat(chromaInput.value);
    console.log(`current values - hue: ${h}, chroma: ${c}`);

    //update slider text numbers
    if(valHue) valHue.innerText = h;
    if(valChroma) valChroma.innerText = c;

    //set lightness constants
    const bgL = isDark ? 0.1 : 0.98;
    const textL = isDark ? 0.95 : 0.15;
    const accentL = isDark ? 0.75 : 0.55;

    //create colors and convert to hex
    try {
        const bgHex = culori.formatHex({ mode: 'oklch', l: bgL, c: 0.02, h: h });
        const textHex = culori.formatHex({ mode: 'oklch', l: textL, c: 0.02, h: h });
        const accentHex = culori.formatHex({ mode: 'oklch', l: accentL, c: c, h: h });

        //apply to css variables
        document.documentElement.style.setProperty('--bg', bgHex);
        document.documentElement.style.setProperty('--text', textHex);
        document.documentElement.style.setProperty('--accent', accentHex);

        //update hex display labels
        document.getElementById('hex-bg').innerText = bgHex;
        document.getElementById('hex-text').innerText = textHex;
        document.getElementById('hex-accent').innerText = accentHex;
        
        console.log("ui updated successfully");
    } catch (err) {
        console.error("error during color conversion:", err);
    }
}

//add the listeners
hueInput.addEventListener('input', () => {
    console.log("hue slider moved");
    updatePalette();
});

chromaInput.addEventListener('input', () => {
    console.log("chroma slider moved");
    updatePalette();
});

modeBtn.addEventListener('click', () => {
    isDark = !isDark;
    modeBtn.innerText = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    updatePalette();
});

//run once on load
window.addEventListener('load', updatePalette);

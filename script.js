// Get HTML elements
const sampleTextDiv = document.getElementById('sampleText');
const typingInput = document.getElementById('typingInput');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const restartBtn = document.getElementById('restartBtn');

// State variables
let currentSample = "";
let time = 60;
let timer = null;
let started = false;

// Highlight sample text as user types
function highlightSample() {
    const input = typingInput.value;
    let html = "";
    for (let i = 0; i < currentSample.length; i++) {
        if(i < input.length){
            if (input[i] === currentSample[i]) {
                html += `<span class="text-green-600">${currentSample[i]}</span>`;
            }
            else{
                html += `<span class="text-red-600">${currentSample[i]}</span>`;
            }
        }
        else{
             html += `<span class="text-gray-400">${currentSample[i]}</span>`;
        }
    }
    sampleTextDiv.innerHTML = html;
}

// Get a random quote from API
async function getSampleText() {
    try {
        const res = await fetch('https://api.api-ninjas.com/v1/quotes', {
            headers: { 'X-Api-Key': '/HvhkijghaU/nb9zkVxSeA==ghOD5QwQLkcHtNum' }
        });
        const data = await res.json();
        currentSample = data[0].quote;
    } catch {
        currentSample = "The quick brown fox jumps over the lazy dog.";
    }
    highlightSample();
    typingInput.value = '';
    typingInput.disabled = false;
}

// Update stats
function updateStats() {
    const input = typingInput.value;
    const words = input.split(' ').filter(word => word).length;
    const mins = (60 - time) / 60;
    let wpm = 0;
    if (mins > 0) {
        wpm = Math.round(words / mins);
    }
    wpmDisplay.textContent = wpm;
    let correct = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] === currentSample[i]) correct++;
    }
    let accuracy = input.length > 0 ? Math.round((correct / input.length) * 100) : 100;
    accuracyDisplay.textContent = accuracy;
}


// Start timer
function startTimer() {
    if (started) return;
    started = true;
    timer = setInterval(() => {
        time--;
        timerDisplay.textContent = time;
        updateStats();
        if (time <= 0) {
            clearInterval(timer);
            typingInput.disabled = true;
        }
    }, 1000);
}

// Typing event
typingInput.addEventListener('input', () => {
    if (!started) startTimer();
    updateStats();
    highlightSample();
});

// Restart event
restartBtn.addEventListener('click', async () => {
    clearInterval(timer);
    time = 60;
    timerDisplay.textContent = time;
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100';
    started = false;
    await getSampleText();
    typingInput.focus();
});

// On load
window.addEventListener('DOMContentLoaded', async () => {
    time = 60;
    timerDisplay.textContent = time;
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100';
    started = false;
    await getSampleText();
    typingInput.focus();
});

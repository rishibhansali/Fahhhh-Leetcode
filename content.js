const SUCCESS_RESULT = 'Accepted';
const FAILURE_RESULTS = ['Wrong Answer', 'Runtime Error', 'Compile Error', 'Time Limit Exceeded', 'Memory Limit Exceeded'];
const PENDING = '__pending__';

let watching = false;
let lastSubmitResult = PENDING;
let lastRunResult = PENDING;

const playSelectedMeme = (key) => {
    chrome.storage.local.get([key, 'volume', 'duration'], (data) => {
        const filename = data[key] || (key === 'successMeme' ? 'spiderman-meme-song.mp3' : 'fahhhhh.mp3');
        const audio = new Audio(chrome.runtime.getURL(`sounds/${filename}`));

        audio.volume = data.volume ?? 0.5;
        audio.play().catch(() => {});

        const limit = (data.duration || 5) * 1000;
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, limit);
    });
};

const handleResult = (resultText) => {
    chrome.storage.local.get(['extensionEnabled'], (res) => {
        if (res.extensionEnabled === false) return;
        if (resultText === SUCCESS_RESULT) {
            playSelectedMeme('successMeme');
        } else if (FAILURE_RESULTS.includes(resultText)) {
            playSelectedMeme('failMeme');
        }
    });
};

// Runs on every Submit (result shows up in the "Submission Detail" tab label)
const checkSubmitResult = () => {
    const text = document.getElementById('submission-detail_tab')?.innerText.trim();
    if (!text || text === lastSubmitResult) return;
    lastSubmitResult = text;
    handleResult(text);
};

// Runs on every Run (result shows up inside the Test Result panel, not the tab label)
const checkRunResult = () => {
    const text = document.querySelector('[data-e2e-locator="console-result"]')?.innerText.trim();
    if (!text || text === lastRunResult) return;
    lastRunResult = text;
    handleResult(text);
};

document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    const locator = btn?.getAttribute('data-e2e-locator');
    const isRunOrSubmit = locator === 'console-run-button' || locator === 'console-submit-button' ||
        btn?.innerText.includes('Run') || btn?.innerText.includes('Submit');

    if (isRunOrSubmit) {
        watching = true;
        lastSubmitResult = PENDING;
        lastRunResult = PENDING;
    }
});

setInterval(() => {
    if (!watching) return;
    checkSubmitResult();
    checkRunResult();
}, 500);

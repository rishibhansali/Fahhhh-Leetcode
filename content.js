let isWaitingForSubmission = false;
let currentResultElement = null;

// 1. Listen for the SUBMIT button click
document.addEventListener('click', (e) => {
    const isSubmitBtn = e.target.innerText === "Submit" ||
    e.target.closest('button')?.innerText.includes("Submit");

    if (isSubmitBtn) {
        chrome.storage.local.get(['extensionEnabled'], (res) => {
            if (res.extensionEnabled === false) return;
            isWaitingForSubmission = true;
            currentResultElement = document.querySelector('span.marked_as_success, h3');
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }
});

// 2. Play function using Storage
const playSelectedMeme = (key) => {
    chrome.storage.local.get([key, 'volume', 'duration'], (data) => {
        const filename = data[key] || (key === 'successMeme' ? 'spiderman-meme-song.mp3' : 'fahhhhh.mp3');
        const audio = new Audio(chrome.runtime.getURL(`sounds/${filename}`));
        
        audio.volume = data.volume || 0.5;
        audio.play();

        // Stop audio after X seconds
        const limit = (data.duration || 5) * 1000;
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, limit);
    });
    observer.disconnect(); // Stop observing until next submission
};


// 3. Robust Observer
const observer = new MutationObserver(() => {
    if (!isWaitingForSubmission) return;

    // Check for "Accepted" using the specific class you identified
    const successSpan = document.querySelector('span.marked_as_success');
    
    // Check for "Wrong Answer" in headers
    const headers = document.querySelectorAll('h3');
    let wrongAnswerEl = null;
    for (let h3 of headers) {
        if (h3.innerText.includes("Wrong Answer")) {
            wrongAnswerEl = h3;
            break;
        }
    }

    const errorSpan = document.querySelector('span[data-e2e-locator="console-result"]');
    // 3. Check for Runtime Error 
    const isRuntimeError = errorSpan && errorSpan.innerText.includes("Runtime Error");

    // 4 . compile Error check 
    const isCompileError = errorSpan && errorSpan.innerText.includes("Compile Error");

    // 5. TLE 
    const isTLE = errorSpan && errorSpan.innerText.includes("Time Limit Exceeded");   
    
    const failureEl = wrongAnswerEl || errorSpan;
    const failureSpan = failureEl && (
        failureEl.innerText.includes("Wrong Answer") ||
        failureEl.innerText.includes("Runtime Error") ||
        failureEl.innerText.includes("Compile Error") ||
        failureEl.innerText.includes("Time Limit Exceeded")
    );

    if (successSpan && successSpan !== currentResultElement) {
        playSelectedMeme('successMeme');
        isWaitingForSubmission = false;
        currentResultElement = successSpan;
    } else if ( failureSpan && currentResultElement !== failureSpan) {
        playSelectedMeme('failMeme');
        isWaitingForSubmission = false;
        currentResultElement = failureSpan;
    }
});
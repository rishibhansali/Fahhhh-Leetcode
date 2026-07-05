
const memeNames = {
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-e-lutador.mp3": "AAAA-E-Lutador",
  "among-us-role-reveal-sound.mp3": "Among Us Role",
  "anime-wow-sound-effect-mp3cut.mp3": "Anime Wow",
  "are u crazy.mp3": "Are You Crazy?",
  "baby-laughing-meme.mp3": "Baby Laugh",
  "cat-laugh-meme-1.mp3": "Cat Laugh",
  "coffin-dance.mp3": "Coffin Dance",
  "dexter-meme.mp3": "Dexter Oh No",
  "dun-dun-dun-sound-effect-brass_8nFBccR.mp3": "Dun Dun Dun!",
  "emotional-damage-meme.mp3": "Emotional Damage",
  "error.mp3": "Windows Error",
  "fahhhhh.mp3": "Faaah!",
  "galaxy-meme.mp3": "Shooting Stars",
  "meme-de-creditos-finales.mp3": "Directed by...",
  "my-movie-6_0RlWMvM.mp3": "My Movie Tune",
  "no-no-wait-wait.mp3": "Wait Wait Wait!",
  "oh-my-god-meme.mp3": "Oh My God",
  "run-vine-sound-effect.mp3": "Run!",
  "sad-vilon.mp3": "Sad Violin",
  "snoop-dog.mp3": "Smoke Weed Everyday",
  "spiderman-meme-song.mp3": "Spiderman Theme",
  "vine-boom-sound-effect_KT89XIq.mp3": "Vine Boom"
}

const memes = Object.keys(memeNames); // Gets the filenames from the keys

document.addEventListener('DOMContentLoaded', () => {
    const successSel = document.getElementById('successSelect');
    const failSel = document.getElementById('failSelect');
    let currentAudio = null;
    let activeBtn = null;

    const populateDropdowns = () => {
        memes.forEach(filename => {
            const displayName = memeNames[filename]; // Gets the clean name

            const successOpt = new Option(displayName, filename);
            const failOpt = new Option(displayName, filename);

            document.getElementById('successSelect').add(successOpt);
            document.getElementById('failSelect').add(failOpt);
        });

        document.getElementById('successSelect').value = "spiderman-meme-song.mp3"; // Default Success
        document.getElementById('failSelect').value = "fahhhhh.mp3"; // Default Fail
        document.getElementById("saveBtn").click(); // Save defaults to storage
    };

    populateDropdowns();

    const playPreview = (selectId, btnId) => {
        const btn = document.getElementById(btnId);
        const filename = document.getElementById(selectId).value;
        const vol = document.getElementById('volumeRange').value;

        // 1. If the SAME button is clicked while playing, PAUSE it
        if (currentAudio && activeBtn === btn) {
            currentAudio.pause();
            currentAudio = null;
            activeBtn = null;
            btn.innerText = "▶";
            return;
        }

        // 2. If a DIFFERENT sound was playing, stop it first
        if (currentAudio) {
            currentAudio.pause();
            if (activeBtn) activeBtn.innerText = "▶";
        }

        // 3. Start New Playback
        currentAudio = new Audio(chrome.runtime.getURL(`sounds/${filename}`));
        currentAudio.volume = vol;
        activeBtn = btn;
        btn.innerText = "⏸";

        currentAudio.play().catch(e => {
            console.log("Playback blocked: Click the popup first.");
            btn.innerText = "▶";
        });

        // 4. Reset icon when the audio finishes naturally
        currentAudio.onended = () => {
            btn.innerText = "▶";
            currentAudio = null;
            activeBtn = null;
        };
    };

    document.getElementById('playSuccess').onclick = () => playPreview('successSelect', 'playSuccess');
    document.getElementById('playFail').onclick = () => playPreview('failSelect', 'playFail');
    document.getElementById('enabledToggle').onchange = (e) => {
        chrome.storage.local.set({ extensionEnabled: e.target.checked });
    };
    document.getElementById('saveBtn').addEventListener('click', () => {
        chrome.storage.local.set({
            successMeme: successSel.value,
            failMeme: failSel.value,
            volume: document.getElementById('volumeRange').value,
            duration: document.getElementById('durationLimit').value
        }, () => {
            const status = document.getElementById('status');
            status.innerText = "Preferences Saved! ✅";
            setTimeout(() => status.innerText = "", 2000);
        });
    });

    // Load/Save Settings
    chrome.storage.local.get(['successMeme', 'failMeme', 'volume', 'duration' , "extensionEnabled"], (res) => {
        if (res.successMeme) successSel.value = res.successMeme;
        if (res.failMeme) failSel.value = res.failMeme;
        if (res.volume!=undefined) document.getElementById('volumeRange').value = res.volume;
        if (res.duration) document.getElementById('durationLimit').value = res.duration;
        document.getElementById('enabledToggle').checked = res.extensionEnabled !== false;
    });
});

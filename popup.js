document.addEventListener('DOMContentLoaded', () => {
    let timerDisplay = document.getElementById('timer');
    let startBtn = document.getElementById('startBtn');
    let aiBtn = document.getElementById('aiBtn');
    let noteInput = document.getElementById('noteInput');
    let responseBox = document.getElementById('aiResponseBox');
    let responseDisplay = document.getElementById('aiResponse');
    let modeBadge = document.getElementById('modeBadge');
    let rewardBox = document.getElementById('rewardBox');
    let blockAlert = document.getElementById('blockAlert');
    
    let timeLeft = 5 * 60;
    let timeId = null;

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener((message) => {
            if (message.action === "tabBlocked" && blockAlert) {
                blockAlert.style.display = "block";
                setTimeout(() => { blockAlert.style.display = "none"; }, 4000);
            }
        });
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (timeId == null) {
                if (rewardBox) rewardBox.style.display = "none";
                if (blockAlert) blockAlert.style.display = "none";
                if (modeBadge) {
                    modeBadge.textContent = "Focus Mode";
                    modeBadge.style.backgroundColor = "#e11d48";
                }
                
                startBtn.innerText = "Pause Focus";
                startBtn.style.backgroundColor = "#d97706";

                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                    chrome.runtime.sendMessage({ action: "startFocus", duration: timeLeft });
                }

                timeId = setInterval(() => {
                    if (timeLeft <= 0) {
                        clearInterval(timeId);
                        
                        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                            chrome.runtime.sendMessage({ action: "playReleaseVoice" });
                        }
                        
                        if (rewardBox) rewardBox.style.display = "block";
                        
                        timeLeft = 5 * 60;
                        timeId = null;
                        startBtn.innerText = "Start Focus Mode";
                        startBtn.style.backgroundColor = "#4f46e5";
                        timerDisplay.innerText = "05:00";
                        
                        if (modeBadge) {
                            modeBadge.textContent = "Normal Mode";
                            modeBadge.style.backgroundColor = "#4f46e5";
                        }
                    } else {
                        timeLeft--;
                        let minutes = Math.floor(timeLeft / 60);
                        let seconds = timeLeft % 60;
                        timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    }
                }, 1000);
            } else {
                clearInterval(timeId);
                timeId = null;
                startBtn.innerText = "Resume Focus";
                startBtn.style.backgroundColor = "#4f46e5";
                
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                    chrome.runtime.sendMessage({ action: "pauseFocus" });
                }
            }
        });
    }

    if (aiBtn) {
        aiBtn.addEventListener('click', async () => {
            let noteText = noteInput.value.trim();

            if (!noteText) {
                alert("Please write something first!");
                return;
            }
            if (responseBox) responseBox.style.display = "block";
            if (responseDisplay) responseDisplay.innerText = "Connecting to Gemini Server...";

                       const API_KEY = ""; 
            
            if (API_KEY === "") {
                setTimeout(() => {
                    if (responseDisplay) {
                        responseDisplay.innerText = "Stay focused! Distractions are temporary, success is permanent. Task: Turn off notifications and code for 15 mins.";
                    }
                }, 1000);
                return;
            }

            const url = `https://googleapis.com{API_KEY}`;

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: `The user is distracted and wrote this thought: "${noteText}". Provide a 1-sentence motivational advice and convert the thought into 1 clear actionable task.` }] }]
                    })
                });

                const data = await response.json();

                if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                    let aiText = data.candidates[0].content.parts[0].text;
                    if (responseDisplay) responseDisplay.innerText = aiText;
                } else {
                    if (responseDisplay) responseDisplay.innerText = "Stay focused! YouTube can wait. Your task: Complete your current coding module first.";
                }
            } catch (error) {
                if (responseDisplay) responseDisplay.innerText = "Stay focused! Distractions are temporary, success is permanent. Task: Turn off notifications and code for 15 mins.";
            }
        });
    }
});

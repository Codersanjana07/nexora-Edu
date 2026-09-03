let blockedSites = ["youtube.com", "instagram.com", "facebook.com", "twitter.com", "x.com"];
let blockInterval = null;

function playSystemVoice(textToSpeak) {
  chrome.tts.speak(textToSpeak, {
    lang: 'en-US',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startBlocking") {
    if (!blockInterval) {
      blockInterval = setInterval(() => {
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            if (tab.url) {
              const url = tab.url.toLowerCase();
              let detectedSite = "";

              if (url.includes("youtube.com")) {
                detectedSite = "YouTube";
              } else if (url.includes("instagram.com")) {
                detectedSite = "Instagram";
              } else if (url.includes("facebook.com")) {
                detectedSite = "Facebook";
              } else if (url.includes("twitter.com") || url.includes("x.com")) {
                detectedSite = "Twitter";
              }

              if (detectedSite !== "") {
                chrome.tabs.update(tab.id, { url: "about:blank" });
                playSystemVoice(`Warning! ${detectedSite} is blocked. Please focus on your work.`);
                chrome.runtime.sendMessage({ action: "tabBlocked" }).catch(() => {});
              }
            }
          });
        });
      }, 1000);
    }
  } else if (request.action === "stopBlocking") {
    if (blockInterval) {
      clearInterval(blockInterval);
      blockInterval = null;
    }
  } else if (request.action === "playReleaseVoice") {
    playSystemVoice("Focus session complete! Instagram and all tabs are now released. Enjoy your reward!");
  }
});

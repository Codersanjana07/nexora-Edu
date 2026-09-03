let isFocusModeActive = false;
const blockedSites = ["youtube.com", "instagram.com", "facebook.com", "twitter.com", "x.com"];

function playSystemVoice(textToSpeak) {
  chrome.tts.speak(textToSpeak, {
    lang: 'en-US',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  });
}

function getSiteName(url) {
  if (url.includes("youtube.com")) return "YouTube";
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("facebook.com")) return "Facebook";
  if (url.includes("twitter.com") || url.includes("x.com")) return "Twitter";
  return "";
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startFocus" || request.action === "startBlocking") {
    isFocusModeActive = true;
  } else if (request.action === "pauseFocus" || request.action === "stopBlocking") {
    isFocusModeActive = false;
  } else if (request.action === "playReleaseVoice") {
    playSystemVoice("Focus session complete! All tabs are now released. Enjoy your reward!");
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (isFocusModeActive && changeInfo.url) {
    const url = changeInfo.url.toLowerCase();
    const detectedSite = getSiteName(url);

    if (detectedSite !== "") {
      chrome.tabs.update(tabId, { url: "about:blank" });
      playSystemVoice(`Warning! ${detectedSite} is blocked. Please focus on your work.`);
      chrome.runtime.sendMessage({ action: "tabBlocked" }).catch(() => {});
    }
  }
});

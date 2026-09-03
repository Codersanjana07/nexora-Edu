let isFocusModeActive = false;
const blockedSites = ["youtube.com", "instagram.com", "facebook.com", "twitter.com", "x.com"];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startFocus") {
    isFocusModeActive = true;
  } else if (request.action === "pauseFocus") {
    isFocusModeActive = false;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (isFocusModeActive && changeInfo.url) {
    const url = changeInfo.url.toLowerCase();
    const isBlocked = blockedSites.some(site => url.includes(site));

    if (isBlocked) {
      chrome.tabs.update(tabId, { url: "about:blank" });
      chrome.runtime.sendMessage({ action: "tabBlocked" }).catch(() => {});
    }
  }
});

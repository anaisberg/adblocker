const hostsListUrl =  "https://block.energized.pro/spark/formats/domains.txt";
const extraList = "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_general_block.txt";

let urlsToBlock = [];
let blockedResquestsCount = 0;
let isAdBlockActive = true;

const blockRequest = requestDetails => {
    blockedResquestsCount ++;
    chrome.browserAction.setBadgeText({ text: blockedResquestsCount.toString() });
    return { cancel: true };
};

const enableAdBlocking = () => {
    chrome.webRequest.onBeforeRequest.addListener(blockRequest, { urls: urlsToBlock }, ["blocking"]);
    chrome.browserAction.setBadgeText({ text: blockedResquestsCount.toString() });
    localStorage.setItem('isAdBlockActive', 'true');
    isAdBlockActive = true;
}

const disableAdBlocking = () => {
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest)
    chrome.browserAction.setBadgeText({ text: "off" });
    localStorage.setItem('isAdBlockActive', 'false');
    isAdBlockActive = false;
}

const initAdBlocking = async () => {

    // getting the first url list correctly formatted
    const hostsResponse = await fetch(hostsListUrl)
    const hostsResponseText = await hostsResponse.text()
    const hostsToBlock = hostsResponseText
            .split('\n')
            .filter(url => url !== 'track*.datatrics.com')
            .filter(url => !url.startsWith('#'))
            .map(url => `*://${url}/*`);

    // getting the second url list correctly formatted
    const extraResponse = await fetch(extraList)
    const extraText = await extraResponse.text()
    const extraPatternsToBlock = extraText
        .split('\n')
        .filter(url => url.length !== 0 && !url.startsWith("! "))
        .map(url => `*://*/*${url}*`);

    // putting the two together
    urlsToBlock = hostsToBlock.concat(extraPatternsToBlock);
    enableAdBlocking();
}

initAdBlocking();

chrome.runtime.onMessage.addListener((message, _sender, sendRes) => {
    if (message.type !== "toggleAdBlocking") return;
    if (isAdBlockActive) {
        disableAdBlocking();
        sendRes('off');
    } else {
        enableAdBlocking();
        sendRes('on');
    }
})

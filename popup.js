if (localStorage.getItem('isAdBlockActive') === 'true') {
    document.getElementById('toggle').setAttribute('class', 'checked');
    document.getElementById('state').innerHTML = 'on';
} else {
    document.getElementById('toggle').setAttribute('class', '');
    document.getElementById('state').innerHTML = 'off';
}

document.getElementById('toggle').addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "toggleAdBlocking" }, res => {
        if (res === 'on') {
            document.getElementById('toggle').setAttribute('class', 'checked');
        } else {
            document.getElementById('toggle').setAttribute('class', '');
        }
        document.getElementById('state').innerHTML = res;
    });
})
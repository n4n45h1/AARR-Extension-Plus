// ==UserScript==
// @name        discord token login / AARR Manage multi Discord accounts
// @namespace    http://tampermonkey.net/
// @version      6.3
// @description  The best token loginer with the most features by AARR Remade by nanachi
// @author       nanachi
// @match        https://discord.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license     AARR
// ==/UserScript==

(function() {
    'use strict';

    const maxTokens = 50;
    let currentGroup = GM_getValue('currentGroup', 'A');
    let isBoxVisible = false;


    const toggleImage = document.createElement('img');
    toggleImage.src = 'https://i.imgur.com/RbbQDhI.png';
    toggleImage.style.position = 'fixed';
    toggleImage.style.width = '30px';
    toggleImage.style.height = '30px';
    toggleImage.style.cursor = 'pointer';
    toggleImage.style.zIndex = '1001';
    toggleImage.style.left = '75px';
    toggleImage.style.bottom = '156px';
    document.body.appendChild(toggleImage);

    toggleImage.addEventListener('click', () => {
        isBoxVisible = !isBoxVisible;
        mainContainer.style.display = isBoxVisible ? 'block' : 'none';
        saveToggleImageVisibility();
    });


    function saveToggleImageVisibility() {
        GM_setValue('isBoxVisible', isBoxVisible);
    }

    const container = document.createElement('div');
    container.innerHTML = `
        <div id="mainContainer" style="position: fixed; background-color: #2f3136; color: #ffffff; padding: 10px; border-radius: 5px; z-index: 1000; width: 175px; height: 29px; overflow-y: auto;">
            <div id="dragHandle" style="cursor: move; height: 15px; margin-bottom: 5px; text-align: center; background-color: #444; border-radius: 3px; display: flex; justify-content: center; align-items: center; user-select: none;">
                <span style="font-size: 10px;">ドラッグして移動 ⋮⋮</span>
            </div>
            <button id="toggleButton" style="width: 100%; margin-bottom: 10px; padding: 10px; background-color: #575757; color: #ffffff; border: none; border-radius: 3px; cursor: pointer; transition: background-color 0.3s;">トークンログイン</button>
            <div id="content" style="display: none;">
                <h2 style="margin: 0 0 10px 0;">AARR Multi Token Login V6.3</h2>
                <a href="https://aarr-homepage.github.io/page/about5.html" target="_blank" style="color: #00BFFF; text-decoration: underline; display: block; margin-bottom: 10px;">🔧その他のツール</a>
                <a href="https://greasyfork.org/ja/scripts/523829-manage-multi-discord-accounts/code" target="_blank" style="color: #00BFFF; text-decoration: underline; display: block; margin-bottom: 10px;">⚙️ソースコード</a>
                <div id="groupButtons" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <button id="groupA" style="width: 30%; height: 30px; background-color: #575757; color: #ffffff; border: none; border-radius: 3px; cursor: pointer;">A</button>
                    <button id="groupB" style="width: 30%; height: 30px; background-color: #575757; color: #ffffff; border: none; border-radius: 3px; cursor: pointer;">B</button>
                    <button id="groupC" style="width: 30%; height: 30px; background-color: #575757; color: #ffffff; border: none; border-radius: 3px; cursor: pointer;">C</button>
                </div>
               <div style="display: flex; align-items: center; margin-bottom: 10px;">
    <input type="checkbox" id="newTabCheckbox" style="margin-right: 5px; width: 20px; height: 15px;">
    <label for="newTabCheckbox" style="margin: 0;">新しいタブで開く</label>
</div>
                <button id="saveButton" style="width: 100%; margin-bottom: 10px; padding: 10px; background-color: #575757; color: #ffffff; border: none; border-radius: 3px; cursor: pointer; transition: background-color 0.3s;">📝トークンファイル保存</button>
                <button id="loadButton" style="width: 100%; margin-bottom: 10px; padding: 10px; background-color: #575757; color: #ffffff; border: none; border-radius: 3px; cursor: pointer; transition: background-color 0.3s;">🗒️トークンファイル読込</button>
                <input id="fileInput" type="file" accept=".txt" style="display: none;">
                <button id="hideButton" style="width: 100%; margin-bottom: 10px; padding: 10px; background-color: #575757; color: #ffffff; border: none; border-radius: 3px; cursor: pointer; transition: background-color 0.3s;">👁️‍🗨️入力欄表示/非表示</button>
                <h5 style="margin: 0 0 10px 0;">招待URL</h5>
                <input type="text" id="urlInput" placeholder="リダイレクト用招待URL" style="width: 100%; margin-bottom: 5px; display: block; background-color: #2f3136; color: #32CD32; border: 1px solid #32CD32; padding: 5px;">
                <button id="reloginButton" style="width: 100%; margin-bottom: 10px; padding: 10px; background-color: #575757; color: #ffffff; border: none; border-radius: 3px; cursor: pointer; transition: background-color 0.3s;">🔄再ログイン</button>
                <button id="autoLoginButton" style="width: 100%; margin-bottom: 10px; padding: 20px; background-color: #575757; color: #ffffff; border: none; border-radius: 3px; cursor: pointer; transition: background-color 0.3s;">🟢自動トークン切替ログイン</button>
                <h5 style="margin: 0 0 10px 0;">チャンネルURL</h5>
                <input type="text" id="channelUrlInput" placeholder="チャンネル/メッセージURL" style="width: 100%; margin-bottom: 5px; display: block; background-color: #2f3136; color: #32CD32; border: 1px solid #32CD32; padding: 5px;">
                <button id="channelAccessButton" style="width: 100%; margin-bottom: 10px; padding: 10px; background-color: #575757; color: #ffffff; border: none; border-radius: 3px; cursor: pointer; transition: background-color 0.3s;">📌チャンネルアクセス</button>
                <h5 style="margin: 0 0 10px 0;">⚠️ログアウトしないでください、トークンがリセットされます</h5>
                <label style="display: block; margin-bottom: 10px;">
                <div id="tokenInputsContainer">
                    ${Array.from({ length: maxTokens }, (_, i) => `
                        <input type="text" id="tokenInput${i + 1}" placeholder="トークン ${i + 1}" style="width: 100%; margin-bottom: 5px; display: block; background-color: #2f3136; color: #32CD32; border: 1px solid #32CD32; padding: 5px;">
                        <button id="contactButton${i + 1}" style="width: 100%; margin-bottom: 5px; padding: 10px; background-color: #575757; color: #ffffff; border: none; border-radius: 3px; cursor: pointer; transition: background-color 0.3s;">🐥ログイン ${i + 1}</button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const toggleButton = document.getElementById('toggleButton');
    const saveButton = document.getElementById('saveButton');
    const loadButton = document.getElementById('loadButton');
    const hideButton = document.getElementById('hideButton');
    const autoLoginButton = document.getElementById('autoLoginButton');
    const reloginButton = document.getElementById('reloginButton');
    const channelAccessButton = document.getElementById('channelAccessButton');
    const fileInput = document.getElementById('fileInput');
    const tokenInputsContainer = document.getElementById('tokenInputsContainer');
    const content = document.getElementById('content');
    const mainContainer = document.getElementById('mainContainer');
    const dragHandle = document.getElementById('dragHandle');
    const urlInput = document.getElementById('urlInput');
    const channelUrlInput = document.getElementById('channelUrlInput');
    const groupAButton = document.getElementById('groupA');
    const groupBButton = document.getElementById('groupB');
    const groupCButton = document.getElementById('groupC');
    const newTabCheckbox = document.getElementById('newTabCheckbox');

    // ドラッグ機能の追加
    let isDragging = false;
    let offsetX, offsetY;

    // 保存された位置を読み込む
    const savedPos = GM_getValue('panelPosition', { right: '10px', bottom: '200px' });
    mainContainer.style.right = savedPos.right;
    mainContainer.style.bottom = savedPos.bottom;

    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = mainContainer.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        mainContainer.style.transition = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        // 画面からはみ出さないよう制限
        const maxX = window.innerWidth - mainContainer.offsetWidth;
        const maxY = window.innerHeight - mainContainer.offsetHeight;

        const boundedX = Math.max(0, Math.min(maxX, x));
        const boundedY = Math.max(0, Math.min(maxY, y));

        mainContainer.style.right = `${window.innerWidth - boundedX - mainContainer.offsetWidth}px`;
        mainContainer.style.bottom = `${window.innerHeight - boundedY - mainContainer.offsetHeight}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            mainContainer.style.transition = '';

            // 位置を保存
            GM_setValue('panelPosition', {
                right: mainContainer.style.right,
                bottom: mainContainer.style.bottom
            });
        }
    });

    toggleButton.addEventListener('click', toggleContainer);
    saveButton.addEventListener('click', saveTokensToFile);
    loadButton.addEventListener('click', () => fileInput.click());
    hideButton.addEventListener('click', toggleTokenInputs);
    autoLoginButton.addEventListener('click', autoLogin);
    reloginButton.addEventListener('click', () => relogin(false));
    channelAccessButton.addEventListener('click', () => channelAccess());
    fileInput.addEventListener('change', loadTokensFromFile);
    groupAButton.addEventListener('click', () => switchGroup('A'));
    groupBButton.addEventListener('click', () => switchGroup('B'));
    groupCButton.addEventListener('click', () => switchGroup('C'));
    newTabCheckbox.addEventListener('change', () => GM_setValue('newTabCheckbox', newTabCheckbox.checked));

    const buttons = [toggleButton, saveButton, loadButton, hideButton, autoLoginButton, reloginButton, channelAccessButton];
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            if (button === autoLoginButton) {
                button.style.backgroundColor = '#4d7aa1';
            } else {
                button.style.backgroundColor = '#228B22';
            }
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#575757';
        });
    });

    function switchGroup(group) {
        saveToLocalStorage();
        currentGroup = group;
        GM_setValue('currentGroup', currentGroup);
        loadFromLocalStorage();
        updateGroupButtonStyles();
    }

    function updateGroupButtonStyles() {
        const groupButtons = [groupAButton, groupBButton, groupCButton];
        groupButtons.forEach(button => {
            if (button.textContent === 'A') {
                button.style.backgroundColor = (currentGroup === 'A') ? '#a62828' : '#575757';
            } else if (button.textContent === 'B') {
                button.style.backgroundColor = (currentGroup === 'B') ? '#287abd' : '#575757';
            } else if (button.textContent === 'C') {
                button.style.backgroundColor = (currentGroup === 'C') ? '#c99a16' : '#575757';
            }
        });
    }

    let isMinimized = GM_getValue('isMinimized', true);
    function toggleContainer() {
        isMinimized = !isMinimized;
        content.style.display = isMinimized ? 'none' : 'block';
        mainContainer.style.height = isMinimized ? '49px' : '727px'; // ドラッグハンドル用に高さ調整
        mainContainer.style.top = isMinimized ? 'auto' : '5%';
        mainContainer.style.bottom = isMinimized ? '105px' : 'auto';
        toggleButton.style.padding = '10px';
        toggleButton.textContent = isMinimized ? 'トークンログイン' : '⛔最小化';
        GM_setValue('isMinimized', isMinimized);
    }

    let areInputsVisible = GM_getValue('areInputsVisible', true);
    function toggleTokenInputs() {
        areInputsVisible = !areInputsVisible;
        const tokenInputs = tokenInputsContainer.querySelectorAll('input[type="text"]');
        tokenInputs.forEach(input => {
            input.style.display = areInputsVisible ? 'block' : 'none';
        });
        GM_setValue('areInputsVisible', areInputsVisible);
    }

    function login(token) {
        let iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.contentWindow.localStorage.token = `"${token}"`;
        document.body.removeChild(iframe);
        setTimeout(() => {
            const redirectLink = formatURL(urlInput.value.trim());
            if (redirectLink) {
                if (newTabCheckbox.checked) {
                    window.open(redirectLink, '_blank');
                } else {
                    window.location.href = redirectLink;
                }
            } else {
                if (newTabCheckbox.checked) {
                    window.open("https://discord.com/app", '_blank');
                } else {
                    window.location.href = "https://discord.com/app";
                }
            }
        }, 1000);
    }

    function relogin() {
        const lastClickedButtonId = localStorage.getItem(`${currentGroup}_lastClickedButton`);
        if (lastClickedButtonId) {
            const lastClickedButton = document.getElementById(lastClickedButtonId);
            if (lastClickedButton) {
                const token = document.getElementById(`tokenInput${lastClickedButtonId.replace('contactButton', '')}`).value.trim();
                reloginToken(token);
            }
        } else {
            alert('以前使用したトークンが見つかりません。まずトークンを使用してください。');
        }
    }

    function channelAccess() {
        const lastClickedButtonId = localStorage.getItem(`${currentGroup}_lastClickedButton`);
        if (lastClickedButtonId) {
            const lastClickedButton = document.getElementById(lastClickedButtonId);
            if (lastClickedButton) {
                const token = document.getElementById(`tokenInput${lastClickedButtonId.replace('contactButton', '')}`).value.trim();
                channelAccessToken(token);
            }
        } else {
            alert('以前使用したトークンが見つかりません。まずトークンを使用してください。');
        }
    }

    function reloginToken(token) {
        let iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.contentWindow.localStorage.token = `"${token}"`;
        document.body.removeChild(iframe);
        setTimeout(() => {
            const redirectLink = formatURL(urlInput.value.trim());
            if (redirectLink) {
                window.location.href = redirectLink;
            } else {
                window.location.href = "https://discord.com/app";
            }
        }, 1000);
    }

    function channelAccessToken(token) {
        let iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.contentWindow.localStorage.token = `"${token}"`;
        document.body.removeChild(iframe);
        setTimeout(() => {
            const channelURL = formatChannelURL(channelUrlInput.value.trim());
            if (channelURL) {
                window.location.href = channelURL;
            } else {
                window.location.href = 'https://discord.com/app';
            }
        }, 1000);
    }

    function formatURL(url) {
        if (!url) {
            return '';
        }

        if (url.startsWith('discord.gg/')) {
            return `https://${url}`;
        } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return `https://discord.gg/${url}`;
        }

        return url;
    }

    function formatChannelURL(url) {
        if (!url) {
            return '';
        }

        if (url.startsWith('https://discord.com/channels/')) {
            return url;
        } else {
            return `https://discord.com/channels/${url}`;
        }
    }

    function saveToLocalStorage() {
        const tokens = [];
        for (let i = 1; i <= maxTokens; i++) {
            const tokenInput = document.getElementById(`tokenInput${i}`);
            tokens.push(tokenInput.value);
            GM_setValue(`${currentGroup}_tokenInput${i}`, tokenInput.value);
        }
        GM_setValue(`${currentGroup}_urlInput`, urlInput.value);
        GM_setValue(`${currentGroup}_channelUrlInput`, channelUrlInput.value);
        GM_setValue('newTabCheckbox', newTabCheckbox.checked);
    }

    function loadFromLocalStorage() {
        for (let i = 1; i <= maxTokens; i++) {
            const tokenInput = document.getElementById(`tokenInput${i}`);
            const savedToken = GM_getValue(`${currentGroup}_tokenInput${i}`, '');
            tokenInput.value = savedToken;

            const contactButton = document.getElementById(`contactButton${i}`);
            if (tokenInput.value.trim() === '') {
                contactButton.disabled = true;
                contactButton.style.backgroundColor = '#000000';
                contactButton.removeEventListener('mouseover', buttonMouseOver);
                contactButton.removeEventListener('mouseout', buttonMouseOut);
            } else {
                contactButton.disabled = false;
                const isGreen = GM_getValue(`${currentGroup}_contactButton${i}_isGreen`, false);
                contactButton.style.backgroundColor = isGreen ? '#228B22' : '#575757';
                contactButton.addEventListener('mouseover', buttonMouseOver);
                contactButton.addEventListener('mouseout', buttonMouseOut);
            }
        }
        const savedURL = GM_getValue(`${currentGroup}_urlInput`, '');
        urlInput.value = savedURL;
        const savedChannelURL = GM_getValue(`${currentGroup}_channelUrlInput`, '');
        channelUrlInput.value = savedChannelURL;
        newTabCheckbox.checked = GM_getValue('newTabCheckbox', false);
    }

    function saveTokensToFile() {
        const tokens = [];
        for (let i = 1; i <= maxTokens; i++) {
            const tokenInput = document.getElementById(`tokenInput${i}`);
            tokens.push(tokenInput.value);
        }
        const blob = new Blob([tokens.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tokens_${currentGroup}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function loadTokensFromFile(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const tokens = e.target.result.split('\n');
                tokens.forEach((token, index) => {
                    const tokenInput = document.getElementById(`tokenInput${index + 1}`);
                    if (tokenInput) {
                        tokenInput.value = token.trim();
                        GM_setValue(`${currentGroup}_tokenInput${index + 1}`, token.trim());
                        updateButtonState(tokenInput, `contactButton${index + 1}`);
                    }
                });
            };
            reader.readAsText(file);
        }
    }

    function autoLogin() {
        const lastClickedButtonId = localStorage.getItem(`${currentGroup}_lastClickedButton`);
        if (lastClickedButtonId) {
            const lastClickedButtonIndex = parseInt(lastClickedButtonId.replace('contactButton', ''), 10);
            const nextButtonIndex = lastClickedButtonIndex + 1;
            if (nextButtonIndex <= maxTokens) {
                const nextButton = document.getElementById(`contactButton${nextButtonIndex}`);
                if (nextButton) {
                    nextButton.click();
                }
            } else {
                alert('自動ログイン用のトークンがこれ以上ありません。最初のトークンに戻ります。');
                const firstButton = document.getElementById('contactButton1');
                if (firstButton) {
                    firstButton.click();
                }
            }
        } else {
            const firstButton = document.getElementById('contactButton1');
            if (firstButton) {
                firstButton.click();
            }
        }
    }

    function buttonMouseOver(event) {
        event.target.style.backgroundColor = '#228B22';
    }

    function buttonMouseOut(event) {
        const index = event.target.id.replace('contactButton', '');
        const isGreen = GM_getValue(`${currentGroup}_contactButton${index}_isGreen`, false);
        if (!isGreen) {
            event.target.style.backgroundColor = '#575757';
        }
    }

    function updateButtonState(tokenInput, buttonId) {
        const contactButton = document.getElementById(buttonId);
        if (tokenInput.value.trim() === '') {
            contactButton.disabled = true;
            contactButton.style.backgroundColor = '#000000';
            contactButton.removeEventListener('mouseover', buttonMouseOver);
            contactButton.removeEventListener('mouseout', buttonMouseOut);
        } else {
            contactButton.disabled = false;
            contactButton.style.backgroundColor = '#575757';
            contactButton.addEventListener('mouseover', buttonMouseOver);
            contactButton.addEventListener('mouseout', buttonMouseOut);
        }
    }

    for (let i = 1; i <= maxTokens; i++) {
        const contactButton = document.getElementById(`contactButton${i}`);
        const tokenInput = document.getElementById(`tokenInput${i}`);

        updateButtonState(tokenInput, `contactButton${i}`);

        contactButton.addEventListener('click', () => {
            const token = tokenInput.value.trim();
            if (token) {
                login(token);

                localStorage.setItem(`${currentGroup}_lastClickedButton`, `contactButton${i}`);

                for (let j = 1; j <= maxTokens; j++) {
                    const btn = document.getElementById(`contactButton${j}`);
                    btn.style.backgroundColor = '#575757';
                    GM_setValue(`${currentGroup}_contactButton${j}_isGreen`, false);
                }

                contactButton.style.backgroundColor = '#228B22';
                GM_setValue(`${currentGroup}_contactButton${i}_isGreen`, true);

                localStorage.setItem(`${currentGroup}_lastUsedToken`, token);
            } else {
                alert('有効なトークンを入力してください！');
            }
        });

        tokenInput.addEventListener('input', () => {
            saveToLocalStorage();
            updateButtonState(tokenInput, `contactButton${i}`);
        });
    }

    window.addEventListener('load', () => {
        loadFromLocalStorage();
        const isMinimized = GM_getValue('isMinimized', true);
        areInputsVisible = GM_getValue('areInputsVisible', true);
        isBoxVisible = GM_getValue('isBoxVisible', false);
        content.style.display = isMinimized ? 'none' : 'block';
        mainContainer.style.display = isBoxVisible ? 'block' : 'none';
        mainContainer.style.height = isMinimized ? '49px' : '727px'; // ドラッグハンドル用に高さ調整
        mainContainer.style.top = isMinimized ? 'auto' : '5%';
        // 保存された位置を読み込む
        const savedPos = GM_getValue('panelPosition', { right: '10px', bottom: '200px' });
        mainContainer.style.right = savedPos.right;
        mainContainer.style.bottom = savedPos.bottom;

        toggleButton.style.padding = '10px';
        toggleButton.textContent = isMinimized ? 'トークンログイン' : '⛔最小化';

        const tokenInputs = tokenInputsContainer.querySelectorAll('input[type="text"]');
        tokenInputs.forEach(input => {
            input.style.display = areInputsVisible ? 'block' : 'none';
        });

        const lastClickedButtonId = localStorage.getItem(`${currentGroup}_lastClickedButton`);
        if (lastClickedButtonId) {
            const lastClickedButton = document.getElementById(lastClickedButtonId);
            if (lastClickedButton) {
                lastClickedButton.style.backgroundColor = '#228B22';
            }
        }

        updateGroupButtonStyles();
    });

    window.addEventListener('beforeunload', saveToLocalStorage);
})();

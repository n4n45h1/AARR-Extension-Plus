// ==UserScript==
// @name         Discord ID Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract Discord channel IDs, user IDs and server ID.
// @author       Nanachi
// @match        https://discord.com/*
// @grant        none
// @license      AARR
// ==/UserScript==

(function() {
    'use strict';

    function makeElementDraggable(el) {
        el.onmousedown = function(event) {
            if (event.target === el || event.target.tagName === 'H2') {
                event.preventDefault();

                let shiftX = event.clientX - el.getBoundingClientRect().left;
                let shiftY = event.clientY - el.getBoundingClientRect().top;

                function moveAt(pageX, pageY) {
                    el.style.left = Math.min(Math.max(0, pageX - shiftX), window.innerWidth - el.offsetWidth) + 'px';
                    el.style.top = Math.min(Math.max(0, pageY - shiftY), window.innerHeight - el.offsetHeight) + 'px';
                }

                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);
                }

                document.addEventListener('mousemove', onMouseMove);

                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }

                document.addEventListener('mouseup', onMouseUp);
            }
        };

        el.ondragstart = function() {
            return false;
        };
    }

    function addResizeButtons(el, initialWidth, initialHeight) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.right = '5px';
        buttonContainer.style.top = '5px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '5px';
        el.appendChild(buttonContainer);

        const enlargeButton = document.createElement('button');
        enlargeButton.textContent = '＋';
        enlargeButton.style.padding = '2px 5px';
        enlargeButton.style.fontSize = '10px';
        enlargeButton.style.backgroundColor = '#575757';
        enlargeButton.style.color = '#ffffff';
        enlargeButton.style.border = 'none';
        enlargeButton.style.borderRadius = '3px';
        enlargeButton.style.cursor = 'pointer';
        enlargeButton.style.transition = 'color 0.3s, background-color 0.3s';
        enlargeButton.onmouseenter = () => {
            enlargeButton.style.backgroundColor = '#4CAF50';
            enlargeButton.style.color = '#ffffff';
        };
        enlargeButton.onmouseleave = () => {
            enlargeButton.style.backgroundColor = '#575757';
            enlargeButton.style.color = '#ffffff';
        };
        buttonContainer.appendChild(enlargeButton);

        const shrinkButton = document.createElement('button');
        shrinkButton.textContent = '－';
        shrinkButton.style.padding = '2px 5px';
        shrinkButton.style.fontSize = '10px';
        shrinkButton.style.backgroundColor = '#575757';
        shrinkButton.style.color = '#ffffff';
        shrinkButton.style.border = 'none';
        shrinkButton.style.borderRadius = '3px';
        shrinkButton.style.cursor = 'pointer';
        shrinkButton.style.transition = 'color 0.3s, background-color 0.3s';
        shrinkButton.onmouseenter = () => {
            shrinkButton.style.backgroundColor = '#f44336';
            shrinkButton.style.color = '#ffffff';
        };
        shrinkButton.onmouseleave = () => {
            shrinkButton.style.backgroundColor = '#575757';
            shrinkButton.style.color = '#ffffff';
        };
        buttonContainer.appendChild(shrinkButton);

        enlargeButton.addEventListener('click', () => {
            el.style.width = (el.clientWidth + 50) + 'px';
            el.style.height = (el.clientHeight + 50) + 'px';
        });

        shrinkButton.addEventListener('click', () => {
            el.style.width = initialWidth;
            el.style.height = initialHeight;
        });
    }

    const initialWidth = '320px';
    const initialHeight = '400px';

    const container = document.createElement('div');
    container.id = 'discordIdExtractor';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.backgroundColor = '#2f3136';
    container.style.color = '#ffffff';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.zIndex = '10000';
    container.style.width = initialWidth;
    container.style.height = initialHeight;
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    document.body.appendChild(container);

    makeElementDraggable(container);
    addResizeButtons(container, initialWidth, initialHeight);

    const headerSection = document.createElement('div');
    headerSection.style.marginBottom = '10px';
    headerSection.style.padding = '8px';
    headerSection.style.backgroundColor = '#36393f';
    headerSection.style.borderRadius = '5px';
    container.appendChild(headerSection);

    const title = document.createElement('h2');
    title.textContent = 'Discord ID Extractor';
    title.style.margin = '0 0 8px 0';
    title.style.fontSize = '14px';
    title.style.textAlign = 'center';
    title.style.cursor = 'move';
    headerSection.appendChild(title);

    const serverInfoContainer = document.createElement('div');
    serverInfoContainer.style.display = 'flex';
    serverInfoContainer.style.alignItems = 'center';
    serverInfoContainer.style.justifyContent = 'space-between';
    headerSection.appendChild(serverInfoContainer);

    const serverLabel = document.createElement('span');
    serverLabel.textContent = 'Server ID:';
    serverLabel.style.fontSize = '11px';
    serverLabel.style.color = '#b9bbbe';
    serverInfoContainer.appendChild(serverLabel);

    const serverInfo = document.createElement('div');
    serverInfo.style.display = 'flex';
    serverInfo.style.alignItems = 'center';
    serverInfoContainer.appendChild(serverInfo);

    const serverId = document.createElement('span');
    serverId.id = 'currentServerId';
    serverId.textContent = 'Not detected';
    serverId.style.fontSize = '11px';
    serverId.style.marginRight = '5px';
    serverId.style.color = '#dcddde';
    serverInfo.appendChild(serverId);

    const copyServerIdButton = document.createElement('button');
    copyServerIdButton.textContent = 'Copy';
    copyServerIdButton.style.fontSize = '9px';
    copyServerIdButton.style.padding = '2px 4px';
    copyServerIdButton.style.marginLeft = '5px';
    copyServerIdButton.style.backgroundColor = '#4f545c';
    copyServerIdButton.style.border = 'none';
    copyServerIdButton.style.borderRadius = '2px';
    copyServerIdButton.style.color = '#ffffff';
    copyServerIdButton.style.cursor = 'pointer';
    serverInfo.appendChild(copyServerIdButton);

    copyServerIdButton.addEventListener('click', () => {
        const id = serverId.textContent;
        if (id !== 'Not detected') {
            navigator.clipboard.writeText(id).then(() => {
                const originalBg = copyServerIdButton.style.backgroundColor;
                copyServerIdButton.style.backgroundColor = '#43b581';
                setTimeout(() => {
                    copyServerIdButton.style.backgroundColor = originalBg;
                }, 500);
            });
        }
    });

    const tabContainer = document.createElement('div');
    tabContainer.style.display = 'flex';
    tabContainer.style.borderBottom = '1px solid #4f545c';
    tabContainer.style.marginBottom = '5px';
    container.appendChild(tabContainer);

    const contentContainer = document.createElement('div');
    contentContainer.style.flex = '1';
    contentContainer.style.display = 'flex';
    contentContainer.style.flexDirection = 'column';
    contentContainer.style.overflowY = 'hidden';
    container.appendChild(contentContainer);

    const tabs = [];
    const contents = [];

    function addTab(title, isActive = false) {
        const tab = document.createElement('div');
        tab.textContent = title;
        tab.style.padding = '2px 8px';
        tab.style.fontSize = '11px';
        tab.style.cursor = 'pointer';
        tab.style.borderTopLeftRadius = '3px';
        tab.style.borderTopRightRadius = '3px';
        tab.style.transition = 'background-color 0.3s';

        if (isActive) {
            tab.style.backgroundColor = '#4f545c';
            tab.style.color = '#ffffff';
        } else {
            tab.style.backgroundColor = 'transparent';
            tab.style.color = '#b9bbbe';
        }

        tabContainer.appendChild(tab);

        const content = document.createElement('div');
        content.style.display = isActive ? 'flex' : 'none';
        content.style.flexDirection = 'column';
        content.style.flex = '1';
        content.style.overflowY = 'hidden';
        contentContainer.appendChild(content);

        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.style.backgroundColor = 'transparent';
                t.style.color = '#b9bbbe';
            });
            contents.forEach(c => {
                c.style.display = 'none';
            });

            tab.style.backgroundColor = '#4f545c';
            tab.style.color = '#ffffff';
            content.style.display = 'flex';
        });

        tabs.push(tab);
        contents.push(content);

        return content;
    }

    const channelContent = addTab('Channels', true);
    const userContent = addTab('Users');

    function createList(container, listId) {
        const wrapper = document.createElement('div');
        wrapper.style.flex = '1';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.overflowY = 'hidden';
        container.appendChild(wrapper);

        const statsContainer = document.createElement('div');
        statsContainer.style.display = 'flex';
        statsContainer.style.justifyContent = 'space-between';
        statsContainer.style.padding = '5px';
        statsContainer.style.backgroundColor = '#2f3136';
        statsContainer.style.borderRadius = '3px';
        statsContainer.style.marginBottom = '5px';
        statsContainer.style.fontSize = '10px';
        wrapper.appendChild(statsContainer);

        const countDisplay = document.createElement('span');
        countDisplay.textContent = 'Count: 0';
        statsContainer.appendChild(countDisplay);

        const limitDisplay = document.createElement('span');
        limitDisplay.textContent = 'Limit: 1000';
        statsContainer.appendChild(limitDisplay);

        const list = document.createElement('ul');
        list.id = listId;
        list.style.listStyleType = 'none';
        list.style.padding = '0';
        list.style.margin = '0';
        list.style.fontSize = '12px';
        list.style.overflowY = 'auto';
        list.style.flex = '1';
        list.style.borderRadius = '3px';
        list.style.backgroundColor = '#36393f';
        list.style.padding = '5px';
        wrapper.appendChild(list);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'space-between';
        buttonsContainer.style.marginTop = '8px';
        wrapper.appendChild(buttonsContainer);

        const copyButton = createButton('Copy All');
        const clearButton = createButton('Clear');

        buttonsContainer.appendChild(copyButton);
        buttonsContainer.appendChild(clearButton);

        return {
            list,
            copyButton,
            clearButton,
            countDisplay
        };
    }

    function createButton(text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '4px 8px';
        button.style.fontSize = '11px';
        button.style.backgroundColor = '#575757';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';
        button.onmouseenter = () => {
            button.style.backgroundColor = '#7289da';
        };
        button.onmouseleave = () => {
            button.style.backgroundColor = '#575757';
        };
        return button;
    }

    const channelList = createList(channelContent, 'channelList');
    const userList = createList(userContent, 'userList');

    const extractedData = {
        currentServer: { id: null },
        channels: new Map(),
        users: new Map()
    };

    const MAX_IDS = 1000;

    function detectCurrentServer() {
        const urlMatch = window.location.href.match(/discord\.com\/channels\/(\d+)/);

        if (urlMatch) {
            const newServerId = urlMatch[1];

            if (newServerId !== extractedData.currentServer.id && newServerId !== '@me') {
                extractedData.currentServer.id = newServerId;

                serverId.textContent = newServerId;

                channelList.list.innerHTML = '';
                extractedData.channels.clear();
                updateCountDisplay(channelList.countDisplay, 0);

                userList.list.innerHTML = '';
                extractedData.users.clear();
                updateCountDisplay(userList.countDisplay, 0);

                extractChannelIDs();
                extractUserIDs();

                return true;
            } else if (newServerId === '@me') {
                extractedData.currentServer.id = '@me';

                serverId.textContent = 'N/A';

                return false;
            }
        }

        return false;
    }

    function updateCountDisplay(countElement, count) {
        countElement.textContent = `Count: ${count}`;
        if (count >= MAX_IDS) {
            countElement.style.color = '#f04747';
        } else {
            countElement.style.color = '#b9bbbe';
        }
    }

    function extractChannelIDs() {
        if (extractedData.currentServer.id === '@me' || !extractedData.currentServer.id) return;

        if (extractedData.channels.size >= MAX_IDS) return;

        const channelElements = document.querySelectorAll('[class*="channelName-"], [class*="name-"][role="link"], [id^="channels-"] [class*="name-"]');

        for (const element of channelElements) {
            try {
                if (extractedData.channels.size >= MAX_IDS) break;

                let linkElement = element;
                while (linkElement && linkElement.tagName !== 'A' && !linkElement.getAttribute('href')) {
                    linkElement = linkElement.parentElement;
                    if (!linkElement) break;
                }

                if (!linkElement || !linkElement.getAttribute) continue;

                const href = linkElement.getAttribute('href');
                if (!href) continue;

                const match = href.match(/\/channels\/\d+\/(\d+)/);
                if (!match) continue;

                const channelId = match[1];
                if (extractedData.channels.has(channelId)) continue;

                let channelName = element.textContent.trim();
                if (!channelName) {
                    channelName = 'Unknown Channel';
                }

                const listItem = createListItem(channelId, channelName, 'channel');
                channelList.list.appendChild(listItem);

                extractedData.channels.set(channelId, {
                    name: channelName,
                    element: listItem
                });

                updateCountDisplay(channelList.countDisplay, extractedData.channels.size);
            } catch (error) {
                console.error('Error extracting channel ID:', error);
            }
        }

        const linkElements = document.querySelectorAll('a[href*="/channels/"]');
        for (const link of linkElements) {
            try {
                if (extractedData.channels.size >= MAX_IDS) break;

                const urlParts = link.href.split('/');
                if (urlParts.length < 6) continue;

                const linkServerId = urlParts[4];
                if (linkServerId !== extractedData.currentServer.id) continue;

                const channelId = urlParts[5];
                if (extractedData.channels.has(channelId)) continue;

                let channelName = 'Unknown Channel';
                const nameElement = link.querySelector('[class*="name-"]') || link;
                if (nameElement && nameElement.textContent) {
                    channelName = nameElement.textContent.trim();
                }

                const listItem = createListItem(channelId, channelName, 'channel');
                channelList.list.appendChild(listItem);

                extractedData.channels.set(channelId, {
                    name: channelName,
                    element: listItem
                });

                updateCountDisplay(channelList.countDisplay, extractedData.channels.size);
            } catch (error) {
                console.error('Error extracting channel ID from link:', error);
            }
        }
    }

    function extractUserIDs() {
        if (extractedData.users.size >= MAX_IDS) return;

        const avatarElements = document.querySelectorAll('img[src*="cdn.discordapp.com/avatars/"]');

        for (const img of avatarElements) {
            try {
                if (extractedData.users.size >= MAX_IDS) break;

                const url = img.src;
                const match = url.match(/avatars\/(\d+)\//);
                if (!match) continue;

                const userId = match[1];
                if (extractedData.users.has(userId)) continue;

                let userName = 'Unknown User';

                let parent = img.parentElement;
                for (let i = 0; i < 5 && parent; i++) {
                    const nameElement = parent.querySelector('[class*="username-"]') ||
                                       parent.querySelector('[class*="name-"]');
                    if (nameElement && nameElement.textContent) {
                        userName = nameElement.textContent.trim();
                        break;
                    }
                    parent = parent.parentElement;
                }
                
                const listItem = createListItem(userId, null, 'user');
                userList.list.appendChild(listItem);

                extractedData.users.set(userId, {
                    name: userName,
                    element: listItem
                });

                updateCountDisplay(userList.countDisplay, extractedData.users.size);
            } catch (error) {
                console.error('Error extracting user ID:', error);
            }
        }
    }

    function createListItem(id, name, type) {
        const item = document.createElement('li');
        item.style.padding = '5px';
        item.style.marginBottom = '2px';
        item.style.backgroundColor = '#40444b';
        item.style.borderRadius = '3px';
        item.style.cursor = 'pointer';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.dataset.id = id;
        item.dataset.type = type;

        const textContainer = document.createElement('div');
        textContainer.style.overflow = 'hidden';
        textContainer.style.textOverflow = 'ellipsis';
        textContainer.style.whiteSpace = 'nowrap';
        textContainer.style.flex = '1';
        item.appendChild(textContainer);

        const idSpan = document.createElement('span');
        idSpan.textContent = id;
        idSpan.style.color = type === 'user' ? '#dcddde' : '#72767d';
        idSpan.style.fontSize = type === 'user' ? '12px' : '10px';
        textContainer.appendChild(idSpan);

        if (type === 'channel' && name) {
            textContainer.appendChild(document.createTextNode(' '));
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = name;
            nameSpan.style.color = '#dcddde';
            textContainer.appendChild(nameSpan);
        }

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.style.fontSize = '9px';
        copyButton.style.padding = '2px 4px';
        copyButton.style.backgroundColor = '#4f545c';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '2px';
        copyButton.style.color = '#ffffff';
        copyButton.style.cursor = 'pointer';
        copyButton.style.marginLeft = '5px';
        item.appendChild(copyButton);

        copyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(id).then(() => {
                const originalBg = copyButton.style.backgroundColor;
                copyButton.style.backgroundColor = '#43b581';
                setTimeout(() => {
                    copyButton.style.backgroundColor = originalBg;
                }, 500);
            });
        });

        return item;
    }

    function copyAllIds(type, list) {
        let dataMap;
        switch (type) {
            case 'channel':
                dataMap = extractedData.channels;
                break;
            case 'user':
                dataMap = extractedData.users;
                break;
            default:
                return;
        }

        const formattedData = Array.from(dataMap.keys()).join(' ');
        
        if (formattedData) {
            navigator.clipboard.writeText(formattedData).then(() => {
                console.log(`All ${type} IDs copied to clipboard!`);
            }).catch(err => {
                console.error(`Failed to copy ${type} IDs:`, err);
            });
        }
    }

    function clearIds(type, list, countDisplay) {
        let dataMap;
        switch (type) {
            case 'channel':
                dataMap = extractedData.channels;
                break;
            case 'user':
                dataMap = extractedData.users;
                break;
            default:
                return;
        }

        list.innerHTML = '';
        dataMap.clear();
        updateCountDisplay(countDisplay, 0);
    }

    channelList.copyButton.addEventListener('click', () => copyAllIds('channel', channelList.list));
    channelList.clearButton.addEventListener('click', () => clearIds('channel', channelList.list, channelList.countDisplay));

    userList.copyButton.addEventListener('click', () => copyAllIds('user', userList.list));
    userList.clearButton.addEventListener('click', () => clearIds('user', userList.list, userList.countDisplay));

    const footerSection = document.createElement('div');
    footerSection.style.borderTop = '1px solid #4f545c';
    footerSection.style.marginTop = '10px';
    footerSection.style.paddingTop = '5px';
    footerSection.style.fontSize = '9px';
    footerSection.style.color = '#72767d';
    footerSection.style.textAlign = 'center';
    container.appendChild(footerSection);

    const creditLine1 = document.createElement('div');
    creditLine1.textContent = 'Original by AARR';
    footerSection.appendChild(creditLine1);

    const creditLine2 = document.createElement('div');
    creditLine2.textContent = 'Remade by nanachi';
    footerSection.appendChild(creditLine2);

    function startAutoExtraction() {
        detectCurrentServer();
        extractChannelIDs();
        extractUserIDs();

        let lastUrl = window.location.href;

        const checkForUrlChanges = () => {
            if (lastUrl !== window.location.href) {
                lastUrl = window.location.href;

                if (!detectCurrentServer()) {
                    extractChannelIDs();
                    extractUserIDs();
                }
            }
        };

        setInterval(checkForUrlChanges, 1000);

        const observer = new MutationObserver(() => {
            setTimeout(() => {
                if (extractedData.channels.size < MAX_IDS) {
                    extractChannelIDs();
                }

                if (extractedData.users.size < MAX_IDS) {
                    extractUserIDs();
                }
            }, 1000);
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    startAutoExtraction();
})();

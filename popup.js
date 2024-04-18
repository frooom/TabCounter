document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['tabCount', 'bookmarkCount'], (data) => {
    document.getElementById('tabCount').innerText = 'Tabs: ' + (data.tabCount || '0');
    document.getElementById('bookmarkCount').innerText = 'Bookmarks: ' + (data.bookmarkCount || '0');
  });

  // list of YT pages
  chrome.tabs.query({ url: 'https://www.youtube.com/*' }, (tabs) => {
    tabs.forEach((tab) => {
      tab.formattedTitle = formatTitle(tab.title);
    });
    tabs.sort((a, b) => a.formattedTitle.localeCompare(b.formattedTitle));

    const table = document.createElement('table');
    tabs.forEach(tab => {
      const tabRow = renderTab(tab);
      table.appendChild(tabRow);
    });
    document.body.appendChild(table);
  });

  // function formatTime(time) {
  //   const hours = Math.floor(time / 3600);
  //   const minutes = Math.floor((time % 3600) / 60);
  //   const seconds = Math.floor(time % 60);
  //   return `${hours ? hours + 'h ' : ''}${minutes ? minutes + 'm ' : ''}${seconds}s`;
  // }

  function formatTitle(title) {
    let formattedTitle = title.replace(/^\(\d+\)\s+/, '').replace(/\s+-\s+YouTube$/, '');
    if (formattedTitle.length > 80) {
      formattedTitle = formattedTitle.substring(0, 77) + '...';
    }
    return formattedTitle;
  }

  function renderTab(tabDetails) {
    const row = document.createElement('tr');
    const titleCell = document.createElement('td');
    titleCell.textContent = tabDetails.formattedTitle;
    row.appendChild(titleCell);
    const buttonsCell = document.createElement('td');
    buttonsCell.style.textAlign = 'right';

    const goToButton = document.createElement('button');
    goToButton.textContent = 'Goto';
    goToButton.onclick = () => chrome.tabs.update(tabDetails.id, { active: true });
    buttonsCell.appendChild(goToButton);
    // new buttons here...
    row.appendChild(buttonsCell);
    return row;
  }

  function updateCurrentVideo(currentVideoData) {
    // const currentVideoContainer = document.getElementById('videoListContainer');
    const currentVideoContainer = document.getElementById('currentVideoContainer');
    currentVideoContainer.innerHTML = '';

    if (currentVideoData) {
      const titleElement = document.createElement('h1');
      titleElement.textContent = currentVideoData.title;

      const currentTimeElement = document.createElement('p');
      currentTimeElement.textContent = `Current Time: ${currentVideoData.currentTime}`;

      const durationElement = document.createElement('p');
      durationElement.textContent = `Duration: ${currentVideoData.duration}`;

      // creating and adding new buttons
      const buttonsContainer = document.createElement('div');
      // to add new buttons

      currentVideoContainer.appendChild(titleElement);
      currentVideoContainer.appendChild(currentTimeElement);
      currentVideoContainer.appendChild(durationElement);
      currentVideoContainer.appendChild(buttonsContainer);
    }
  }

  function updateVideoList(videosData) {
    const videoListContainer = document.getElementById('videoListContainer');
    // videoListContainer.innerHTML = '';

    // creating new elements for new video
    videosData.forEach((video) => {
      const videoItem = document.createElement('div');
      // videoItem.textContent = `${video.currentTime} - ${video.duration}`;
      videoListContainer.appendChild('videoItem');
      // videoListContainer.appendChild(videoItem);
    });
  }

  // of current video and list video request
  chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url.includes("https://www.youtube.com/")) {
      chrome.tabs.get(details.tabId, (tab) => {
        if (!chrome.runtime.lastError && tab.active && tab.status === 'complete') {
          chrome.tabs.sendMessage(tab.id, { query: "getTimeData" }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error sending message:', chrome.runtime.lastError.message);
              return;
            }
            if (response && response.currentVideoData) {
              updateCurrentVideo(response.currentVideoData);
            }
            if (response && response.videosData) {
              updateVideoList(response.videosData);
            }
          });
        }
      });
    }
  }, { url: [{ urlMatches: 'https://www.youtube.com/' }] });
});

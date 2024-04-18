function updateBadge() {
  chrome.tabs.query({}, (tabs) => {
    const tabCount = tabs.length.toString();
    chrome.action.setBadgeText({ text: tabCount });
    chrome.storage.local.set({ tabCount: tabs.length });
  });

  chrome.bookmarks.getTree((tree) => {
    const bookmarkCount = countBookmarks(tree).toString();
    chrome.storage.local.set({ bookmarkCount });
  });
}

function countBookmarks(nodes) {
  let count = 0;
  for (let node of nodes) {
    if (node.children) {
      count += countBookmarks(node.children);
    } else {
      count += 1;
    }
  }
  return count;
}

chrome.tabs.onUpdated.addListener(updateBadge);
chrome.tabs.onRemoved.addListener(updateBadge);
chrome.tabs.onCreated.addListener(updateBadge);

chrome.action.setBadgeBackgroundColor({ color: '#fff' });

updateBadge();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.query === "getTimeData") {
		console.clear();
		console.log(request.query);
	  const currentTimeElement = document.querySelector('.ytp-time-current');
	  const durationElement = document.querySelector('.ytp-time-duration');
	  let currentVideoData = null;
		console.log(currentTimeElement);
		console.log(durationElement);

	  if (currentTimeElement && durationElement) {
		currentVideoData = {
		  currentTime: currentTimeElement.textContent,
		  duration: durationElement.textContent,
		//   title: document.title.replace(' - YouTube', '')
		};
	  }
  
	  sendResponse({ currentVideoData });
	  return true;
	}
  });
  
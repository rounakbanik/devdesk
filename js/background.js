chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.action === 'getTopSites') {
    	chrome.topSites.get(function(data) {
    		sendResponse({source: data});
    	});
    }

    if(request.action === 'getBookmarks') {
    	chrome.bookmarks.getRecent(50, function(data) {
    		console.log(data);
    		sendResponse({source: data});
    	})
    }

    return true;
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // sent from newtab-contentscript, to get the source
    if(request.action === 'getTopSites') {
    	chrome.topSites.get(function(data) {
    		sendResponse({source: data});
    	});
    }

    if(request.action === 'getBookmarks') {
    	chrome.bookmarks.getRecent(25, function(data) {
    		console.log(data);
    		sendResponse({source: data});
    	})
    }

    return true;
});


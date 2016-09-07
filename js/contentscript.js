function JSONParse(event) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", event.url, true);
	xhr.onreadystatechange = function() {
  		if (xhr.readyState == 4) {
    		info = xhr.responseText;
    		info_obj = jQuery.parseJSON(info);
    		img_src = info_obj[event.key];
    		$(".comic img").fadeOut(400, function() {
    				$(".comic").css("background-color", "#fff");
            		$(this).attr('src',img_src);
            		$(".comic img").css("transform", event.scale);
        		}).fadeIn(400);
  		}
	}
	xhr.send();
}

function HTMLParse(event) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", event.url, true);
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			info = xhr.responseText;
			info_obj = jQuery.parseHTML(info);
			console.log(xhr);
			content = "<h3 class='text-center'><a href='https://news.ycombinator.com/'>News</a></h3><ol>";
			$(info_obj).find(".storylink").each(function(index) {
				var link = $(this).attr("href");
				var title = $(this).html();
				content = content + "<li><a href='" + link + "'>" + title + "</a></li>";
				return index < 9;
			});
			content = content + "</ol><div class='other text-center'><a href='http://www.theverge.com/''><img src='images/verge.ico'></a>&nbsp;<a href='http://mashable.com/'><img src='images/mashable.png'></a>&nbsp;<a href='http://slashdot.org/'><img src='images/slashdot.png'></a>&nbsp;<a href='https://techcrunch.com/'><img src='images/techcrunch.ico'></a></div>";
			$(".news").fadeOut(400, function() {
				$(".news").css("background-color", "#fff");
				$(".news").append(content);
			}).fadeIn(400);
		}
			
	}
	xhr.send();

}

comic_website = {url: "https://xkcd.com/info.0.json", key: "img", scale: "scale(0.9)"};
news_website = {url: "https://news.ycombinator.com/"};
JSONParse(comic_website);
HTMLParse(news_website);


$(document).ready(function() {
	$("#favorite").click(function() {
		chrome.runtime.sendMessage({action: 'getTopSites'}, function(response) {
			urls = response.source;
			document.getElementById("content-menu").innerHTML = "";
			html = "<h4>Most Visited</h4><hr><ol>";
			for(i =0; i<urls.length; i++) {
				html = html + "<li><a href='" + urls[i].url + "'>" + urls[i].title + "</a></li>";
			}
			html = html + "</ol>";
			$('#content-menu').append(html);
		});
	});

	$("#bookmarks").click(function() {
		chrome.runtime.sendMessage({action: 'getBookmarks'}, function(response) {
			urls = response.source;
			console.log(response);
			document.getElementById("content-menu").innerHTML = "";
			html = "<h4>Recent Bookmarks</h4><hr><ol>";
			for(i=0; i<urls.length; i++) {
				html = html + "<li><a href='" + urls[i].url + "'>" + urls[i].title + "</a></li>";
			}
			html = html + "</ol>";
			$('#content-menu').append(html);
		});
	});

	$('#search-box').on('keypress', function(e) {
		if(e.which === 13) {
			window.location.href = "https://duckduckgo.com/?q=" + $('#search-box').val();
		}
	});

});

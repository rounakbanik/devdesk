function JSONParse(event) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", event.url, true);
	xhr.onreadystatechange = function() {
  		if (xhr.readyState == 4) {
    			// innerText does not let the attacker inject HTML elements.
    		info = xhr.responseText;
    		info_obj = jQuery.parseJSON(info);
    		img_src = info_obj[event.key];
    		$(".comic img").fadeOut(400, function() {
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
			 /*$(".img-container img").fadeOut(400, function() {
            		$(this).attr('src',img_src);
            		$(".img-container img").css("transform", event.scale);
					$(".img-container img").css("margin-top", event.margin);
        		}).fadeIn(400);*/
			console.log(xhr);
			content = "";
			$(info_obj).find(".storylink").each(function(index) {
				var link = $(this).attr("href");
				var title = $(this).html();
				content = content + "<li><a href='" + link + "'>" + title + "</a></li>";
				return index < 7;
			});
			console.log(content);
			$(".news ol").append(content);

		}
			
	}
	xhr.send();

}


$(document).ready(function() {
	console.log("Hello");
	comic_website = {url: "https://xkcd.com/info.0.json", key: "img", scale: "scale(0.9)"};
	news_website = {url: "https://news.ycombinator.com/"};
	JSONParse(comic_website);
	HTMLParse(news_website);

});

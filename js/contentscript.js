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

function RandomParse(event) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", event.url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			info = xhr.responseText;
			info_obj = jQuery.parseHTML(info);
			img_src = event.prestr + $(info_obj).find(event.key).attr("src")
			$(".comic img").fadeOut(400, function() {
    				$(".comic").css("background-color", "#fff");
            		$(this).attr('src',img_src);
            		$(".comic img").css("transform", event.scale);
        	}).fadeIn(400);
		}
	}
	xhr.send()
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

function AddChecker() {
	$('input[type=checkbox]').click(function() {
		checkbox_stat = $(this);
		link = $(this).parent().children('span');
		chrome.storage.sync.get(["list_items", "checker"], function(data) {
			ele = link.html();
			array = data.list_items;
			checker_array = data.checker;
			index = array.indexOf(ele);
			if(checkbox_stat.is(':checked')) {
				checker_array[index] = "checked";
			}
			else {
				checker_array[index] = "";
			}
			chrome.storage.sync.set({"checker": checker_array}, function() {});
		});

	});
}

function DeleteItem() {
	$('.delete-item').click(function() {
		link = $(this);
		chrome.storage.sync.get(["list_items", "checker"], function(data) {
			popped = link.parent().children('label').children('span').html();
			array = data.list_items;
			checker_array = data.checker;
			index = array.indexOf(popped);
			array.splice(index, 1);
			checker_array.splice(index, 1);
			chrome.storage.sync.set({"list_items": array, "checker": checker_array}, function() {});
		});
		$(this).parent().remove();
	});
}

//comic_website = {url: "https://xkcd.com/info.0.json", key: "img", scale: "scale(0.9)"};
comic_website = {url: "http://c.xkcd.com/random/comic/", key: "#comic img", scale: "scale(0.9)", prestr: "http:"};
news_website = {url: "https://news.ycombinator.com/"};
//JSONParse(comic_website);
RandomParse(comic_website);
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
			document.getElementById("content-menu").innerHTML = "";
			html = "<h4>Recent Bookmarks</h4><hr><ol>";
			for(i=0; i<urls.length; i++) {
				html = html + "<li><a href='" + urls[i].url + "'>" + urls[i].title + "</a></li>";
			}
			html = html + "</ol>";
			$('#content-menu').append(html);
		});
	});

	$('#todo').click(function() {
		document.getElementById("content-menu").innerHTML = "";
		html = "<input type='text' class='form-control' placeholder='Add New Task' id='todo-box'><br><br><ul id='todo-list'></ul>";
		$('#content-menu').append(html);
		chrome.storage.sync.get(["list_items", "checker"], function(data) {
			storage_item_html = "";
			for(ite in data.list_items) {
				storage_item_html = storage_item_html + "<li><label><input type='checkbox' value=''" + data.checker[ite] + ">&nbsp;&nbsp;<span>" + data.list_items[ite] + "</span></label><a href='#' class='delete-item' style='display:inline;'>&times;</a></li>";
			}
			$('#todo-list').append(storage_item_html);

			DeleteItem();
			AddChecker();

		});
		$('#todo-box').focus();

		$('#todo-box').on('keypress', function(e) {
			if(e.which === 13 && $('#todo-box').val() !== '') {
				item = "<li><label><input type='checkbox' value=''>&nbsp;&nbsp;<span>" + $('#todo-box').val() + "</span></label><a href='#' class='delete-item' style='display: inline;'>&times;</a></li>";
				value_item = $('#todo-box').val();
				chrome.storage.sync.get(["list_items", "checker"], function(data) {
					if(jQuery.isEmptyObject(data)) {
						value_item = [value_item];
						checker_array = [""]
						chrome.storage.sync.set({"list_items": value_item, "checker": checker_array }, function() {});
					}
					else {
						data.list_items.push(value_item);
						data.checker.push("");
						value_item = data.list_items;
						checker_array = data.checker;
						chrome.storage.sync.set({"list_items": value_item, "checker": checker_array }, function() {});
        			}

				});
				$('#todo-box').val('');
				$('#todo-list').append(item);
			}

			DeleteItem();
			AddChecker();
		});

		DeleteItem();
		AddChecker();


	});

	$('#quotes').click(function() {
		document.getElementById("content-menu").innerHTML = "";
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://quotes.rest/qod.json", true);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				info = xhr.responseText;
				console.log(info);
				info_obj = jQuery.parseJSON(info);
				quote = info_obj["contents"]["quotes"][0]["quote"];
				author = info_obj["contents"]["quotes"][0]["author"];
				html = "<br><br><br><blockquote class='quote'>" + quote + "</blockquote><blockquote>" + author + "</blockquote>";
				$("#content-menu").append(html);
			}
		}
		xhr.send();
	});


	$('#search-box').on('keypress', function(e) {
		if(e.which === 13) {
			window.location.href = "https://duckduckgo.com/?q=" + $('#search-box').val();
		}
	});

});

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "300px";
    document.getElementById("main").style.marginLeft = "300px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("content-menu").innerHTML = "";
    document.getElementById("main").style.marginLeft = "0";
}

$(document).ready(function() {
	$('.closebtn').click(closeNav);
	$('.nav-button').click(openNav);
})

console.log("Yes");
$(function(){
	//getParam();
})

function getParam() {
	var url = window.location.href;
	var index = url.indexOf("pid=");
	var param = url.substring(index+4,url.length);
	alert(param);
}

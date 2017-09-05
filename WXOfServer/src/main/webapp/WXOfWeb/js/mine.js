$(function(){
	domain = "http://www.hzfuyao.com";
	requestIP = domain;
	initUserMessage();
})

var mine = new Vue({
	el: "#mine-page",
	data: {
		userMessage: {
			userImg: "../img/20172001.jpg",
			userName: "泊心风物"
		}
	}
})

function initUserMessage(){
	var userToken = $.cookie("user_token");
	alert(userToken);
	var data = {"userToken": userToken};
	$.ajax({
		type: "post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url: requestIP + "/WXOfServer/wxauth/userinfo" ,
		async: true,
		success: function(data){
			if(userToken == undefined){
				return;
			}
			mine.userMessage.userImg = data.headImg;
			mine.userMessage.userName = data.name;
		},
		error: function(){
			
		}
	});
}

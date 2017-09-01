$(function(){
	authWXUser();
})

function authWXUser(){
	var data = new FormData();
	data.append("code", "weixin");
	$.ajax({
		type: "post",
		data: data,
		processData: false,
		url: "http://localhost:8080/WXOfServer/wxauth/auth",
		contentType: false,
		cache: false,
		async: true,
		success: function(data){
			//alert($.cookie("user_token") + data.message);
			window.location.href = "index.html";
		},
		error: function(){
			alert("服务器无响应");
		}
	});
}

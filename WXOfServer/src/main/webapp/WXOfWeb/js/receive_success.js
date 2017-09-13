$(function(){
	domain = "http://www.hzfuyao.com";
	requestIP = domain;
})

function submitComment(){
	var text = $("#comment-text").val();
	if(text == "" || text.length < 1){
		alert("请输入您的意见");
		return;
	}
	var userToken = $.cookie("user_token");
	var data = {"userToken": userToken, "comment": text};
	$.ajax({
		type:"post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url: requestIP + "/WXOfServer/order/comment",
		async:true,
		success: function(data){
			if(data.result == "success"){
				alert("已收到您的宝贵意见~");
				window.location.href = "mine.html";
			}else{
				alert(data.message);
			}
		},
		error: function(){
			alert("服务器故障");
		}
	});
}
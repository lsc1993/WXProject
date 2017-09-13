$(function(){
	domain = "http://localhost";
	imgPath = domain + ":1993/ImageResource/";
	requestIP = domain+":8080";
	initBrowseHistory();
})

var browse = new Vue({
	el: "#my-watch-order",
	data: {
		isShowTip: false,
		watchOrderList: []
	},
	methods: {
		itemClick: function(index){
			window.location.href = "product.html?pId=" + this.watchOrderList[index].pId;
		},
		initOrderList: function(data){
			var list = data.rows;
			var len = data.size;
			if(len == 0){
				this.isShowTip = true;
				return;
			}
			for(var i=0;i < len;++i){
				var order = list[i];
				var item = {
					"id": order.pid,
					"pId": order.pno,
					"name": order.pname,
					"price": order.price,
					"imgurl": imgPath + order.imgurl
				}
				this.watchOrderList.push(item);
			}
		}
	}
})

function initBrowseHistory(){
	var userToken = $.cookie("user_token");
	var data = {"userToken": userToken};
	$.ajax({
		type:"post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url: requestIP + "/WXOfServer/product/browse-history",
		async:true,
		success: function(data){
			browse.initOrderList(data);
		},
		error: function(){
			alert("服务器无响应");
		}
	});
}

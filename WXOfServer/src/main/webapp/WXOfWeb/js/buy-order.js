$(function(){
	domain = "http://localhost";
	imgPath = domain + ":1993/ImageResource/";
	requestIP = domain+":8080";
	start = 0;
	times = 0;
	dropUpLoad();
})

var buyOrder = new Vue({
	el: "#my-buy-order",
	data: {
		isShowTip: false,
		buyOrderList: []
	},
	methods: {
		itemClick: function(index){
			window.location.href = "product.html?pId=" + this.buyOrderList[index].pId;
		},
		initOrderList: function(data){
			var list = data.rows;
			var len = list.length; 
			if(len == 0 && this.buyOrderList.length == 0){
				this.isShowTip = true;
				return;
			}
			for(var i=0;i < len;++i){
				var order = list[i];
				var item = {
					"pId": order.pid,
					"name": order.name,
					"price": order.pTotal,
					"imgurl": imgPath + order.imgurl
				}
				this.buyOrderList.push(item);
			}
		}
	}
})

function dropUpLoad(){
	$("#my-buy-order").dropload({
		scrollArea : window,
        domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData">没有更多了</div>'
        },
        loadDownFn : function(me){
        	var userToken = $.cookie("user_token");
        	var data = {"userToken": userToken,"status": "COMPLETE", "start": start, "limit": 5};
        	$.ajax({
        		type:"post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				//url:"http://localhost:8080/WXOfServer/order/list",
				url: requestIP + "/WXOfServer/order/list",
				async:true,
				success: function(data){
					start++;
					var len = data.result;
					buyOrder.initOrderList(data);
					if(len <= 0){
						me.lock();
						me.noData();
					}
					me.resetload();
				},
				error: function(){
					times++;
					if(times == 5){
						alert("服务器无响应");
						$('.dropload-down').hide();
					} else if(times < 5){
						me.resetload(); 
					}
				}
        	});
        }
	});
}

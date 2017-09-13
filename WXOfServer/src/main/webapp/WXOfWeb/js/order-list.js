$(function(){
	domain = "http://localhost";
	imgPath = domain + ":1993/ImageResource/";
	requestIP = domain+":8080";
	start = new Array(0,0,0,0,0);
	times = 0;
	initPage();
	dropUpLoad();
})

function initPage() { 
	var url = window.location.href;
	var pIndex = url.indexOf("tab=");
	var param = url.substring(pIndex+4,url.length);
	changeTabStyle(param);
}

function tabClick(index){
	changeTabStyle(index);
	times = 0;
	drop.resettabload();
}

function changeTabStyle(index){
	if (index == 0) {
		$("#tab-1").addClass("tab-choosed").siblings().removeClass("tab-choosed");
	} else if(index == 1) {
		$("#tab-2").addClass("tab-choosed").siblings().removeClass("tab-choosed");
	} else if(index == 2) {
		$("#tab-3").addClass("tab-choosed").siblings().removeClass("tab-choosed");
	} else if(index == 3) {
		$("#tab-4").addClass("tab-choosed").siblings().removeClass("tab-choosed");
	} else if(index == 4) {
		$("#tab-5").addClass("tab-choosed").siblings().removeClass("tab-choosed");
	} 
	orderList.showTab(index);
	orderList.index = index;
}

var orderList = new Vue({
	el: "#order-list",
	data: {
		index: 0,
		ShowTabIndex:[true,false,false,false,false],
		orderComplete: [],
		orderPay: [],
		orderSend: [],
		orderReceive: [],
		orderCancel: [],
	},
	methods: {
		initOrderList: function(data){
			var len = data.result;
			var orders = data.rows;
			for(var i=0;i < len;++i){
				var item = orders[i];
				var order = 
				{
					"id": item.id,
					"no": item.orderId,
					"pid": item.pid,
					"name": item.name,
					"imgurl": imgPath + item.imgurl,
					"standard": item.standard,
					"count": item.pCount,
					"pTotal": item.pTotal,
					"total": item.total,
					"status": item.status
				};
				var index1 = this.index;
				if(index1 == 0){
					this.orderPay.push(order);
				}else if(index1 == 1){
					this.orderSend.push(order);
				}else if(index1 == 2){
					this.orderReceive.push(order);
				}else if(index1 == 3){
					this.orderComplete.push(order);
				}else if(index1 == 4){
					this.orderCancel.push(order);
				}
			}
		},
		showTab: function(index){
			var len = this.ShowTabIndex.length;
			for(var i=0;i < len;++i){
				if(i == index){
					this.ShowTabIndex.splice(i,1,true);
				}else{
					this.ShowTabIndex.splice(i,1,false);
				}
			}
		},
		confirmReceive: function(index){
			alert(index);
			var order = this.orderReceive[index];
			alert(order.id);
			var userToken = $.cookie("user_token");
			var data = {"userToken": userToken, "id": order.id, "status": "COMPLETE"};
			$.ajax({
				type: "post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				url: requestIP + "/WXOfServer/order/receive",
				async: true,
				success: function(data){
					if(data.result == "fault"){
						alert(data.message);
					} else {
						window.location.href = "receive_success.html";
					}
				},
				error: function(){
					alert("服务器故障");
				}
			});
		},
		buyAgainCancel: function(index){
			window.location.href = "product.html?pId="+this.orderCancel[index].pid;
		},
		buyAgainComplete: function(index){
			window.location.href = "product.html?pId="+this.orderComplete[index].pid;
		},
		urgeOrder: function(index){
			alert("已收到您的召唤哦~");
		}
	}
})

function dropUpLoad(){
	drop = $("#order-list").dropload({
		scrollArea : window,
        domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData">没有更多了</div>'
        },
        loadDownFn : function(me){
        	var index1 = orderList.index;
        	var status = ["WAITPAY", "WAITSEND", "WAITRECEIVE", "COMPLETE", "CANCEL"];
			var limit = 5;
			var url;
			var userToken = $.cookie("user_token");
			var data = {"userToken": userToken,"status": status[index1], "start": start[index1], "limit": limit};
        	$.ajax({
        		type: "post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				url: requestIP + "/WXOfServer/order/list",
				async: true,
				success: function(data){
					start[index1]++;
					var len = data.result;
					if(len > 0){
						orderList.initOrderList(data);
					} else {
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
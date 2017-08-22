$(function(){
	imgPath = "http://localhost/imageResource/";
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
	drop.reset();
	drop.resetload();
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
				var o = orders[i];
				var order = 
				{
					"id": o.id,
					"no": o.orderId,
					"uid": o.uid,
					"pid": o.pid,
					"pName": o.name,
					"imgurl": imgPath+o.imgurl,
					"standard": o.standard,
					"count": o.pCount,
					"pTotal":o.pTotal,
					"total": o.total,
					"status": o.status
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
		}
	}
})

function dropUpLoad(){
	drop = $("#order-list").dropload({
		scrollArea : window,
        domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData">暂无数据</div>'
        },
        loadDownFn : function(me){
        	var index1 = orderList.index;
        	var status = ["WAITPAY", "WAITSEND", "WAITRECEIVE", "COMPLETE", "CANCEL"];
			var limit = 1;
			var url;
			var data = {"status": status[index1], "start": start[index1], "limit": limit};
        	$.ajax({
        		type: "post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				url: "http://localhost:8080/WXOfServer/order/list",
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
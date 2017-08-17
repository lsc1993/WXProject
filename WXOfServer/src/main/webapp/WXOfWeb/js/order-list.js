$(function(){
	initPage();
})

function initPage() {
	var url = window.location.href;
	var pIndex = url.indexOf("tab=");
	var param = url.substring(pIndex+4,url.length);
	tabClick(parseInt(param));
}

function tabClick(index) {
	if (index == 1) {
		$("#tab-1").addClass("tab-choosed").siblings().removeClass("tab-choosed");
		orderList.showAllOrder();
	} else if(index == 2) {
		$("#tab-2").addClass("tab-choosed").siblings().removeClass("tab-choosed");
		orderList.showPayOrder();
	} else if(index == 3) {
		$("#tab-3").addClass("tab-choosed").siblings().removeClass("tab-choosed");
		orderList.showAcceptOrder();
	} else if(index == 4) {
		$("#tab-4").addClass("tab-choosed").siblings().removeClass("tab-choosed");
		orderList.showSendOrder();
	} else if(index == 5) {
		$("#tab-5").addClass("tab-choosed").siblings().removeClass("tab-choosed");
		orderList.showReceiveOrder();
	} 
}

var orderList = new Vue({
	el: "#order-list",
	data: {
		isShowAllOrder: true,
		isShowPayOrder: false,
		isShowAcceptOrder: false,
		isShowSendOrder: false,
		isShowReceiveOrder: false,
		orderAll: [
		    {
		    	orderNo: "E201707201707220001",
		    	orderStatus: "交易完成",
		    	orderImg: "../img/20172001.jpg",
		    	orderName: "Hao-ha",
		    	orderStandard: "4支",
		    	orderPrice: "299.90",
		    	orderCount: "1",
		    	orderTotal: "299.90",
		    },
		    {
		    	orderNo: "E201707201707220001",
		    	orderStatus: "交易完成",
		    	orderImg: "../img/20172001.jpg",
		    	orderName: "Hao-ha",
		    	orderStandard: "4支",
		    	orderPrice: "299.90",
		    	orderCount: "1",
		    	orderTotal: "299.90",
		    },
		],
		orderPay: [
			{
				orderNo: "E201707201707220001",
		    	orderStatus: "等待付款",
		    	orderImg: "../img/20172001.jpg",
		    	orderName: "Hao-ha",
		    	orderStandard: "4支",
		    	orderPrice: "299.90",
		    	orderCount: "1",
		    	orderTotal: "299.90",
			}
		],
		orderAccept: [
			{
				orderNo: "E201707201707220001",
		    	orderStatus: "等待接单",
		    	orderImg: "../img/20172001.jpg",
		    	orderName: "Hao-ha",
		    	orderStandard: "4支",
		    	orderPrice: "299.90",
		    	orderCount: "1",
		    	orderTotal: "299.90",
			}
		],
		orderSend: [
			{
				orderNo: "E201707201707220001",
		    	orderStatus: "等待发货",
		    	orderImg: "../img/20172001.jpg",
		    	orderName: "Hao-ha",
		    	orderStandard: "4支",
		    	orderPrice: "299.90",
		    	orderCount: "1",
		    	orderTotal: "299.90",
			}
		],
		orderReceive: [
			{
				orderNo: "E201707201707220001",
		    	orderStatus: "等待收货",
		    	orderImg: "../img/20172001.jpg",
		    	orderName: "Hao-ha",
		    	orderStandard: "4支",
		    	orderPrice: "299.90",
		    	orderCount: "1",
		    	orderTotal: "299.90",
			}
		],
	},
	methods: {
		showAllOrder: function(){
			this.isShowAllOrder = true;
			this.isShowPayOrder = false;
			this.isShowAcceptOrder = false;
			this.isShowSendOrder = false;
			this.isShowReceiveOrder = false;
		},
		showPayOrder: function(){
			this.isShowAllOrder = false;
			this.isShowPayOrder = true;
			this.isShowAcceptOrder = false;
			this.isShowSendOrder = false;
			this.isShowReceiveOrder = false;
		},
		showAcceptOrder: function(){
			this.isShowAllOrder = false;
			this.isShowPayOrder = false;
			this.isShowAcceptOrder = true;
			this.isShowSendOrder = false;
			this.isShowReceiveOrder = false;
		},
		showSendOrder: function(){
			this.isShowAllOrder = false;
			this.isShowPayOrder = false;
			this.isShowAcceptOrder = false;
			this.isShowSendOrder = true;
			this.isShowReceiveOrder = false;
		},
		showReceiveOrder: function(){
			this.isShowAllOrder = false;
			this.isShowPayOrder = false;
			this.isShowAcceptOrder = false;
			this.isShowSendOrder = false;
			this.isShowReceiveOrder = true;
		}
	}
})

function initOrder(index){
	
}

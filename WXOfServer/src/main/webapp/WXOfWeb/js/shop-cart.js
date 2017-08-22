$(function(){
	imgPath = "http://localhost/imageResource/";
	initShopItems();
})

var shopCart = new Vue({
	el: "#shop-cart",
	data: {
		total: "0.00",
		isCheckAll: false,
		isShowTip: false,
		shopOrderList: []
	},
	methods: {
		subCount: function(index){  //增加产品数量
			if(this.shopOrderList[index].count > 1){
				this.shopOrderList[index].count--;
				var aTotal = parseFloat(this.total);
				var pTotal = parseFloat(this.shopOrderList[index].total);
				if(this.shopOrderList[index].isChecked){
					aTotal -= pTotal;
				}
				pTotal = this.shopOrderList[index].price*this.shopOrderList[index].count;
				if(this.shopOrderList[index].isChecked){
					aTotal += pTotal;
					this.total = aTotal.toFixed(2);
				}
				this.shopOrderList[index].total = pTotal.toFixed(2);
			}
		},
		addCount: function(index){  //减少产品数量
			if(this.shopOrderList[index].count < 100){
				this.shopOrderList[index].count++;
				var aTotal = parseFloat(this.total);
				var pTotal = parseFloat(this.shopOrderList[index].total);
				if(this.shopOrderList[index].isChecked){
					aTotal -= pTotal;
				}
				pTotal = this.shopOrderList[index].price*this.shopOrderList[index].count;
				if(this.shopOrderList[index].isChecked){
					aTotal += pTotal;
					this.total = aTotal.toFixed(2);
				}
				this.shopOrderList[index].total = pTotal.toFixed(2);
			} else {
				alert("达到一次购买上限");
			}
		},
		gotoProductDetail: function(index){  //跳转产品详情
			window.location.href = "product.html?pid="+this.shopOrderList[index].pId;
		},
		checkAll: function(){  //选中所有购物车中的产品
			if (!this.isCheckAll){
				this.isCheckAll = true;
				var aTotal = 0;
				for(var i = 0;i < this.shopOrderList.length;++i){
					this.shopOrderList[i].isChecked = true;
					var pTotal = parseFloat(this.shopOrderList[i].total);
					aTotal += pTotal;
				}
				
				this.total = aTotal.toFixed(2);
			} else {
				this.isCheckAll = false;
				for(var i = 0;i < this.shopOrderList.length;++i){
					this.shopOrderList[i].isChecked = false;
				}
				this.total = "0.00";
			}
		},
		checkItem: function(index){  //选中某个购物车中的产品
			if(!this.shopOrderList[index].isChecked){
				this.shopOrderList[index].isChecked = true;
			} else {
				this.shopOrderList[index].isChecked = false;
			}
			this.checkAllState();
		},
		checkAllState: function(){   //检查产品状态，更新数据
			var isAll = true;
			var aTotal = 0;
			for(var i = 0;i < this.shopOrderList.length;++i){
				if(!this.shopOrderList[i].isChecked){
					isAll = false;
					break;
				}
			}
			if(isAll){
				this.isCheckAll = true;
				aTotal = 0;
				for(var i = 0;i < this.shopOrderList.length;++i){
					var pTotal = parseFloat(this.shopOrderList[i].total);
					if(this.shopOrderList[i].isChecked){
						aTotal += pTotal;
					}
					
				}
				this.total = aTotal.toFixed(2);
			} else {
				this.isCheckAll = false;
				aTotal = 0;
				for(var i = 0;i < this.shopOrderList.length;++i){
					var pTotal = parseFloat(this.shopOrderList[i].total);
					if(this.shopOrderList[i].isChecked){
						aTotal += pTotal;
					}
				}
				this.total = aTotal.toFixed(2);
			}
		},
		deleteOrder: function(index){  //删除购物车产品
			dialog.showDialog(index);
		},
		initShopCart: function(data){
			var len = data.size;
			if (len == 0){
				this.isShowTip = true;
				return;
			}
			var items = data.rows;
			var length = this.shopOrderList.length;
			this.shopOrderList.splice(0,length);
			for(var i=0;i < len;++i){
				var item = {
					"id": items[i].id,
					"pId": items[i].pid,
					"pno": items[i].pno,
					"sId": items[i].sid,
					"name": items[i].name,
					"imgurl": imgPath + items[i].imgurl,
					"standard": items[i].standard,
					"count": items[i].count,
					"price": items[i].price,
					"total": (parseFloat(items[i].price) * parseInt(items[i].count)).toFixed(2),
					"isChecked": false
				}
				this.shopOrderList.push(item);
			}
			this.checkAllState();
		},
		submitOrder: function(){
			var url = "order.html?"; 
			var len = this.shopOrderList.length;
			var param = "";
			for(var i=0;i < len;++i){
				var item = this.shopOrderList[i];
				if(item.isChecked){
					var pa =  "|pid" + i+ "=" + item.pno 
							+ "|count" + i+ "=" + item.count
							+ "|sid" + i+ "=" + item.sId 
							+ "|standard" + i+ "=" + item.standard
							+ "|price" + i+ "=" + item.price;
					param += pa;
				}
			}
			var encodeParam = encodeURIComponent(param);
	    	window.location.href = url + encodeParam;
		}
	}
})

// 注册对话框组件
Vue.component('dialog-component', {
	props:['message'],
    template: '#dialog-modal'
})

var dialog = new Vue({
	el: "#dialog-tip",
	data: {
		isShow: false,
		message: "是否删除？",
		index: 0
	},
	methods: {
		showDialog: function(index){
			this.isShow = true;
			this.index = index;
		},
		confirm:function(){
			var data = {"id": shopCart.shopOrderList[this.index].id};
			$.ajax({
				type: "post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				url: "http://localhost:8080/WXOfServer/product/del-shop",
				async: true,
				success: function(data){
					initShopItems();
				},
				error: function(){
					alert("服务器无响应");
				}
			});
			this.isShow = false;
		}
	}
})

function initShopItems(){
	var data = {"uId": 1};
	$.ajax({
		type: "post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url: "http://localhost:8080/WXOfServer/product/shopitem",
		async: true,
		success: function(data){
			shopCart.initShopCart(data);
		},
		error: function(){
			alert("服务器无响应");
		}
	});
}

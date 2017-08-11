$(function(){
	
})

var shopCart = new Vue({
	el: "#shop-cart",
	data: {
		total: "0.00",
		isCheckAll: false,
		shopOrderList: [
			{
				pId: "20170089",
				imgurl: "../img/20172001.jpg",
				name: "车厘子大芒果",
				standard: "4斤",
				price: 12.90,
				total: "12.90",
				count: 1,
				type: "泊心风物",
				isChecked: false,
			},
			{
				pId: "20170089",
				imgurl: "../img/20172001.jpg",
				name: "车厘子大芒果",
				standard: "4斤",
				price: 22.90,
				total: "22.90",
				count: 1,
				type: "泊心风物",
				isChecked: false,
			},
			{
				pId: "20170089",
				imgurl: "../img/20172001.jpg",
				name: "车厘子大芒果",
				standard: "4斤",
				price: 22.90,
				total: "22.90",
				count: 1,
				type: "泊心风物",
				isChecked: false,
			}
		]
	},
	methods: {
		subCount: function(index){
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
		addCount: function(index){
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
				alert(达到一次购买上限);
			}
		},
		gotoProductDetail: function(index){
			window.location.href = "product.html?pid="+this.shopOrderList[index].pId;
		},
		checkAll: function(){
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
		checkItem: function(index){
			if(!this.shopOrderList[index].isChecked){
				this.shopOrderList[index].isChecked = true;
			} else {
				this.shopOrderList[index].isChecked = false;
			}
			this.checkAllState();
		},
		checkAllState: function(){
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
		deleteOrder: function(index){
			dialog.showDialog(index);
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
			shopCart.shopOrderList.splice(this.index,1);
			this.isShow = false;
			shopCart.checkAllState();
		}
	}
})
$(function(){
	
})

var shopCart = new Vue({
	el: "#shop-cart",
	data: {
		total: "12.90",
		shopOrderList: [
			{
				pId: "20170089",
				imgurl: "../img/20172001.jpg",
				name: "车厘子大芒果",
				standard: "4斤",
				price: 12.90,
				total: "12.90",
				count: 1,
				type: "泊心风物"
			}
		]
	},
	methods: {
		subCount: function(index){
			if(this.shopOrderList[index].count > 1){
				this.shopOrderList[index].count--;
				var aTotal = new BigNumber(this.total);
				var pTotal = new BigNumber(this.shopOrderList[index].total);
				aTotal -= pTotal;
				pTotal = this.shopOrderList[index].price*this.shopOrderList[index].count;
				aTotal += pTotal;
				this.total = aTotal.toFixed(2);
				this.shopOrderList[index].total = pTotal.toFixed(2);
			}
			//Vue.set(this.shopOrderList,index,this.shopOrderList[index]);
		},
		addCount: function(index){
			if(this.shopOrderList[index].count < 100){
				this.shopOrderList[index].count++;
				var aTotal = new BigNumber(this.total);
				var pTotal = new BigNumber(this.shopOrderList[index].total);
				aTotal -= pTotal;
				pTotal = this.shopOrderList[index].price*this.shopOrderList[index].count;
				aTotal += pTotal;
				this.total = aTotal.toFixed(2);
				this.shopOrderList[index].total = pTotal.toFixed(2);
			}
		},
		gotoProductDetail: function(index){
			window.location.href = "product.html?pid="+this.shopOrderList[index].pId;
		}
	}
})

$(function(){
	
})

var myCollection = new Vue({
	el: "#my-buy-order",
	data: {
		buyOrderList: [
			{
				imgurl: "../img/20172001.jpg",
				productId: "201707012",
				describe: "超级超级佛跳墙强强特瑞dsadsswswq",
				price: "9999"
			}
		]
	},
	methods: {
		itemClick: function(index){
			window.location.href = "product.html?pid=" + this.buyOrderList[index].productId;
		}
	}
})
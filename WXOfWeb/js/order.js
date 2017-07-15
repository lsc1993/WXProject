$(function(){
	autoHeightTextaera();
})

function autoHeightTextaera() {
	$("#buy-message").focus(function(){
		$("#buy-message").animate({height:"80px"},300);
	});
	$("#buy-message").blur(function(){
		$("#buy-message").animate({height:"30px"},300);	
	});
}

var orderPage = new Vue({
	el: "#order-page",
	data: {
		productMessage: 
		    {imgurl: "../img/20172001.jpg",
		     name: "change",
		     standard: "4斤",
		     price: "299.90",
		     count: "1",
		     deliveryCost: "0.00",
		    }
		
	},
	computed: {
		totalCost: function(){
			return parseFloat(this.price) + parseFloat(this.deliveryCost);
		}
	},
	methods: {
		submitOrder: function(){
			
		}
	}
})

var chooseAddressWindow = Vue.component("choose-address-window",{
	props: ['addressItem'],
	template: "#popup-window-address-choose"
})

var newAddressWindow = Vue.component("new-address-window",{
	props: ['addressMessage'],
	template: "#popup-window-address-new"
})

var chooseAddress = new Vue({
	el: "#address-choose",
	data: {
		isShowChooseWindow: false,
		addressItems: [
		    {}
		]
	},
	methods: {
		showChooseWindow: function(){
			this.isShowChooseWindow = true;
		},
		removeChooseWindow: function(){
			this.isShowChooseWindow = false;
		}
	},
	components: {
		'choose-address-window':chooseAddressWindow,
		'new-address-window':newAddressWindow
	}
})

function showChooseWindow() {
	chooseAddress.showChooseWindow();
}
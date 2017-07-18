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
		isShowAddress: false,
		productMessage: 
		{	imgurl: "../img/20172001.jpg",
		    name: "change",
		    standard: "4斤",
		    price: "299.90",
		    count: "1",
		    deliveryCost: "0.00",
		},
		addressMessage: 
		{
			name: "",
			tel: "",
			address: "",
			postcode: ""
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
	props: ['addressitem'],
	template: "#popup-window-address-choose"
})

var newAddressWindow = Vue.component("new-address-window",{
	props: ['addressregion'],
	template: "#popup-window-address-new"
})

var chooseAddress = new Vue({
	el: "#address-choose",
	data: {
		isShowChooseWindow: false,
		isShowEditWindow: false,
		isOneButton: false,
		editTitle: "新建收货地址",
		addressRegion: {
			name: "刘爽",
			tel: "15700084332",
			province: "浙江省",
			city: "杭州市",
			region: "西湖区",
			road: "浙江工业大学屏峰校区",
			address: "浙江省杭州市西湖区浙江工业大学屏峰校区",
			postcode: "453400"
		},
		addressItems: [
		{
			index: 0,
			name: "刘爽",
			tel: "15700084332",
			province: "浙江省",
			city: "杭州市",
			region: "西湖区",
			road: "浙江工业大学屏峰校区",
			address: "浙江省杭州市西湖区浙江工业大学屏峰校区",
			posycode: "453400"
		},
		{
			index: 1,
			name: "刘小爽",
			tel: "15700084332",
			province: "浙江省",
			city: "杭州市",
			region: "西湖区",
			road: "留和路288号浙江工业大学屏峰校区",
			address: "浙江省杭州市西湖区留和路288号浙江工业大学屏峰校区",
			posycode: "453400"
		},
		]
	},
	methods: {
		showChooseWindow: function(){
			this.isShowChooseWindow = true;
		},
		showOneBtnWindow: function(){
			this.isShowEditWindow = true;
			this.isOneButton = false;
			this.editTitle = "新建收货地址";
		},
		showTwoBtnWindow: function(){
			this.isShowEditWindow = true;
			this.isOneButton = true;
			this.editTitle = "编辑收货地址";
		},
		removeChooseWindow: function(){
			this.isShowChooseWindow = false;
		},
		removeEditWindow: function(){
			this.isShowEditWindow = false;
		},
		chooseProvince: function(){
			dialog.chooseProvince();
		},
		chooseCity: function(){
			dialog.chooseCity();
		},
		chooseRegion: function(){
			dialog.chooseRegion(); 
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

function chooseAddressOfIndex(index) {
	orderPage.addressMessage.name = chooseAddress.addressItems[index].name;
	orderPage.addressMessage.tel = chooseAddress.addressItems[index].tel;
	orderPage.addressMessage.address = chooseAddress.addressItems[index].address;
	orderPage.addressMessage.postcode = chooseAddress.addressItems[index].postcode;
	chooseAddress.isShowChooseWindow = false;
	orderPage.isShowAddress = true;
}

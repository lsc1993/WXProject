$(function(){
	
})

var addressManager = new Vue({
	el: "#address-manager",
	data: {
		isShowTip: false,
		addressList: [
			{
				name: "刘爽",
				tel: "15700084332",
				
			}
		]
	}
})

/*
 * 新建与编辑地址Vue组件popupwindow
 * */
var newAddressWindow = Vue.component("new-address-window",{
	props: ['addressregion'],
	template: "#popup-window-address-new"
})

/*
 * 地址popupwindow的Vue实例
 * */
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
		showChooseWindow: function(){ //显示地址选择对话框
			this.isShowChooseWindow = true;
		},
		showOneBtnWindow: function(){  //显示新建收货地址对话框（有一个按钮）
			this.isShowEditWindow = true;
			this.isOneButton = false;
			this.editTitle = "新建收货地址";
		},
		showTwoBtnWindow: function(){  //显示新建收货地址对话框（有两个按钮）
			this.isShowEditWindow = true;
			this.isOneButton = true;
			this.editTitle = "编辑收货地址";
		},
		removeChooseWindow: function(){  //关闭地址选择对话框
			this.isShowChooseWindow = false;
		},
		removeEditWindow: function(){   //关闭新建与编辑地址选择对话框
			this.isShowEditWindow = false;
		},
		chooseProvince: function(){  //选择省份
			dialog.chooseProvince();
		},
		chooseCity: function(){  //选择城市
			dialog.chooseCity();
		},
		chooseRegion: function(){  //选择地区
			dialog.chooseRegion(); 
		}
	},
	components: {
		'new-address-window':newAddressWindow
	}
})
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
				province: "浙江省",
				city: "杭州市",
				region: "西湖区",
				road: "浙江工业大学屏峰校区ytrytr",
				address: "浙江省杭州市西湖区浙江工业大学屏峰校区sss",
				postcode: "453400"	
			}
		]
	},
	methods: {
		showEditWindow: function(index){
			editAddressCache(index);
			chooseAddress.showTwoBtnWindow();
		},
		showBuildWindow: function(){
			resetAddressCache();
			chooseAddress.showOneBtnWindow();
		}
	}
})

/*
 * 新建与编辑地址Vue组件popupwindow
 * */
var newAddressWindow = Vue.component("edit-address-window",{
	props: ['addressregion'],
	template: "#popup-window-address-edit"
})

/*
 * 地址popupwindow的Vue实例
 * */
var chooseAddress = new Vue({
	el: "#address-edit-window",
	data: {
		isShowChooseWindow: false,
		isShowEditWindow: false,
		isOneButton: false,
		editTitle: "编辑收货地址",
		addressRegion: {
			name: "",
			tel: "",
			province: "选择省份",
			city: "选择城市",
			region: "选择地区",
			road: "",
			address: "",
			postcode: ""	
		}
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

var tipDialog = Vue.component("tip-dialog",{
	props: ['message'],
	template: "#address-dialog-modal"
})

var tipDialog = new Vue({
	el: "#tip-dialog-div",
	data: {
		isShowTip: false,
		message: "是否取消编辑内容"
	},
	methods: {
		
	}
})

function editAddressCache(index) {
	chooseAddress.addressRegion.name = addressManager.addressList[index].name;
	chooseAddress.addressRegion.tel = addressManager.addressList[index].tel;
	chooseAddress.addressRegion.province = addressManager.addressList[index].province;
	chooseAddress.addressRegion.city = addressManager.addressList[index].city;
	chooseAddress.addressRegion.region = addressManager.addressList[index].region;
	chooseAddress.addressRegion.road = addressManager.addressList[index].road;
	chooseAddress.addressRegion.address = addressManager.addressList[index].address;
	chooseAddress.addressRegion.postcode = addressManager.addressList[index].postcode;
}

function resetAddressCache() {
	chooseAddress.addressRegion.name = "";
	chooseAddress.addressRegion.tel = "";
	chooseAddress.addressRegion.province = "选择省份";
	chooseAddress.addressRegion.city = "选择城市";
	chooseAddress.addressRegion.region = "选择区域";
	chooseAddress.addressRegion.road = "";
	chooseAddress.addressRegion.address = "";
	chooseAddress.addressRegion.postcode = "";
}

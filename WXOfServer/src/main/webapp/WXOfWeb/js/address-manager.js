$(function(){
	initAddress(1);
})

var addressManager = new Vue({
	el: "#address-manager",
	data: {
		isShowTip: false,
		addressList: [
			/*{
				name: "刘爽",
				tel: "15700084332",
				province: "浙江省",
				city: "杭州市",
				region: "西湖区",
				road: "浙江工业大学屏峰校区ytrytr",
				address: "浙江省杭州市西湖区浙江工业大学屏峰校区sss",
				postcode: "453400"	
			}*/
		]
	},
	methods: {
		initAddressList: function(data){
			var aLength = data.address.length;
			if(aLength == 0){
				this.isShowTip = true;
			}
			this.addressList.splice(0,this.addressList.length);
			for(var i=0;i < aLength;++i){//初始化地址列表
				var address = data.address[i];
				var addr = {id: address.id,
							uid: address.uid,
							name: address.receiver,
							tel: address.phone,
							province: address.province,
							city: address.city,
							region: address.region,
							road: address.detailAddress,
							address: address.province+address.city+address.region+address.detailAddress,
							postcode: address.postcode};
				this.addressList.push(addr);
			}
		},
		showEditWindow: function(index){
			chooseAddress.setAddressCache(index);
			chooseAddress.showTwoBtnWindow();
		},
		showBuildWindow: function(){
			chooseAddress.resetAddressCache();
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
			id: "",
			uid: "",
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
		saveAddress: function(){
			if(!this.checkAddress()){
				return;
			}
			var data = {"id": this.addressRegion.id,
						"uid": 1,
						"receiver": this.addressRegion.name,
						"phone": this.addressRegion.tel,
			            "province": this.addressRegion.province,
			 			"city": this.addressRegion.city,
			 			"region": this.addressRegion.region,
						"detailAddress": this.addressRegion.road,
						"postcode": this.addressRegion.postcode};
			var posturl;
			if(this.addressRegion.id != ""){
				posturl = "http://localhost:8080/WXOfServer/user/update-addr";
			}else{
				posturl = "http://localhost:8080/WXOfServer/user/add-addr";
			}
			$.ajax({
				type: "post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				url: posturl,
				async: true,
				success: function(data){
					tip.showDialog(data.message);
					if(data.result == "success"){
						initAddress(1);
						chooseAddress.removeEditWindow();
					}
				},
				error: function(){
					alert("服务器无响应");
				}
			});
		},
		deleteAddress: function(){  //更新地址信息
			var data = {"id": this.addressRegion.id,
						"uid": 1,
						"receiver": this.addressRegion.name,
						"phone": this.addressRegion.tel,
			            "province": this.addressRegion.province,
			 			"city": this.addressRegion.city,
			 			"region": this.addressRegion.region,
						"detailAddress": this.addressRegion.road,
						"postcode": this.addressRegion.postcode};
			$.ajax({
				type: "post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				url: "http://localhost:8080/WXOfServer/user/del-addr",
				async: true,
				success: function(data){
					tip.showDialog(data.message);
					if(data.result == "success"){
						initAddress(1);
						chooseAddress.removeEditWindow();
					}
				},
				error: function(){
					alert("服务器无响应");
				}
			});
		},
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
		},
		checkAddress: function(){
			if(this.addressRegion.province == "选择省份"){
				tip.showDialog("请选择所在省份"); 
				return false;
			}
			if(this.addressRegion.city == "选择城市"){
				tip.showDialog("请选择所在城市");
				return false;
			}
			if(this.addressRegion.region == "选择地区"){
				tip.showDialog("请选择所在地区");
				return false;
			}
			if(this.addressRegion.road == ""){
				tip.showDialog("请输入详细地址");
				return false;
			}
			if(this.addressRegion.tel == ""){
				tip.showDialog("请输入联系方式");
				return false;
			}
			if(this.addressRegion.name == ""){
				tip.showDialog("请输入联系人姓名");
				return false;
			}
			return true;
		},
		resetAddressCache: function(){
			this.addressRegion.id = "";
			this.addressRegion.uid = "";
			this.addressRegion.name = "";
			this.addressRegion.tel = "";
			this.addressRegion.province = "选择省份";
			this.addressRegion.city = "选择城市";
			this.addressRegion.region = "选择区域";
			this.addressRegion.road = "";
			this.addressRegion.address = "";
			this.addressRegion.postcode = "";
		},
		setAddressCache: function(index){
			var addr = addressManager.addressList[index];
			this.addressRegion.id = addr.id;
			this.addressRegion.uid = addr.uid;
			this.addressRegion.name = addr.name;
			this.addressRegion.tel = addr.tel;
			this.addressRegion.province = addr.province;
			this.addressRegion.city = addr.city;
			this.addressRegion.region = addr.region;
			this.addressRegion.road = addr.road;
			this.addressRegion.address = addr.address;
			this.addressRegion.postcode = addr.postcode;
		}
	},
	components: {
		'new-address-window':newAddressWindow
	}
})

function initAddress(uid){
	var data = {"uId": uid};
	$.ajax({
		type: "post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url: "http://localhost:8080/WXOfServer/user/address",
		async: true,
		success: function(data){
			addressManager.initAddressList(data);
		},
		error: function(){
			alert("服务器无响应");
		}
	});
}

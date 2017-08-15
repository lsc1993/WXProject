$(function(){
	imgPath = "http://localhost/imageResource/";
	autoHeightTextaera();
	initOrder();
})

//买家留言输入框高度伸展
function autoHeightTextaera() {
	$("#buy-message").focus(function(){
		$("#buy-message").animate({height:"80px"},300);
	});
	$("#buy-message").blur(function(){
		$("#buy-message").animate({height:"30px"},300);	
	});
}

/*
 * 订单页面Vue实例
 * */
var orderPage = new Vue({
	el: "#order-page",
	data: {
		isShowAddress: false,
		productMessage: 
		{	imgurl: "../img/20172001.jpg",
		    name: "change",
		    standard: "4斤",
		    price: 299.90,
		    count: "1",
		    deliveryCost: 0.00,
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
			var price = parseFloat(this.productMessage.price) + parseFloat(this.productMessage.deliveryCost);
			return price.toFixed(2);
		}
	},
	methods: {
		initOrderMessage: function(data,standard,count,price){
			this.productMessage.name = data.product.name;
			this.productMessage.count = count;
			this.productMessage.standard = standard;
			this.productMessage.price = (parseFloat(price) * count).toFixed(2);
			var images = data.images;
    		for(var i=0;i < images.length;++i){
    			if(images[i].image.startsWith("sImg")){
    				this.productMessage.imgurl = imgPath + images[i].image;
    				break;
    			}
    		}
		},
		submitOrder: function(){
			
		}
	}
})

/*
 * 选择地址Vue组件popupwindow
 * */
var chooseAddressWindow = Vue.component("choose-address-window",{
	props: ['addressitem'],
	template: "#popup-window-address-choose"
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
			uid: "",
			name: "",
			tel: "",
			province: "选择省份",
			city: "选择城市",
			region: "选择地区",
			road: "",
			address: "",
			postcode: ""
		},
		addressItems: []
	},
	methods: {
		initAddress: function(data){
			for(var i=0;i < data.address.length;++i){//初始化地址列表
				var address = data.address[i];
				var addr = {id: address.id,
							uid: address.uid,
							name: address.receiver,
							tel: address.phone,
							province: address.province,
							city: address.city,
							region: address.region,
							road: address.detailAddress,
							address: address.province+address.city+address.region+data.detailAddress,
							postcode: address.postcode};
				alert(address.receiver);
				this.addressItems.push(addr);
			}
			
		},
		saveAddress: function(){  //保存地址
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
			if(this.addressRegion.id == ""){
				posturl = "http://localhost:8080/WXOfServer/user/add-addr";
			}else{
				posturl = "http://localhost:8080/WXOfServer/user/update-addr";
			}
			$.ajax({
				type: "post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				url: posturl,
				async: true,
				success: function(data){
					alert(data.message);
					if(data.result == "success"){
						initAddress(1);
						this.removeEditWindow();
					}
				},
				error: function(){
					alert("服务器无响应");
				}
			});
		},
		deleteAddress: function(){  //更新地址信息
			var data = {"id": this.addressRegion.id, "uid": this.addressRegion.uid};
			$.ajax({
				type: "post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				url: "http://localhost:8080/WXOfServer/user/del-addr",
				async: true,
				success: function(data){
					alert(data.message);
					if(data.result == "success"){
						initAddress(1);
						this.removeEditWindow();
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
			this.addressReset();
			this.isShowEditWindow = true;
			this.isOneButton = false;
			this.editTitle = "新建收货地址";
		},
		showTwoBtnWindow: function(index){  //显示新建收货地址对话框（有两个按钮）
			this.addressTemp(this.addressItems[index]);
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
		addressReset: function(){  //重置关联地址数据
			this.addressRegion.id = "";
			this.addressRegion.uid = "";
			this.addressRegion.name = "";
			this.addressRegion.tel = "";
			this.addressRegion.province = "选择省份";
			this.addressRegion.city = "选择城市";
			this.addressRegion.region = "选择地区";
			this.addressRegion.road = "";
			this.addressRegion.address = "";
			this.addressRegion.postcode = "";
		},
		addressTemp: function(addr){  //设置关联地址数据
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
		},
		checkAddress: function(){
			if(this.addressRegion.province == "选择省份"){
				alert("请选择所在省份");
				return false;
			}
			if(this.addressRegion.city == "选择城市"){
				alert("请选择所在城市");
				return false;
			}
			if(this.addressRegion.region == "选择地区"){
				alert("请选择所在地区");
				return false;
			}
			if(this.addressRegion.road == ""){
				alert("请输入详细地址");
				return false;
			}
			if(this.addressRegion.tel == ""){
				alert("请输入联系方式");
				return false;
			}
			if(this.addressRegion.name == ""){
				alert("请输入联系人姓名");
				return false;
			}
			return true;
		}
	},
	components: {
		'choose-address-window':chooseAddressWindow,
		'new-address-window':newAddressWindow
	}
})

//显示地址选择对话框
function showChooseWindow() {
	chooseAddress.showChooseWindow();
}

//选择相应位置的地址
function chooseAddressOfIndex(index){
	orderPage.addressMessage.name = chooseAddress.addressItems[index].name;
	orderPage.addressMessage.tel = chooseAddress.addressItems[index].tel;
	orderPage.addressMessage.address = chooseAddress.addressItems[index].address;
	orderPage.addressMessage.postcode = chooseAddress.addressItems[index].postcode;
	chooseAddress.isShowChooseWindow = false;
	orderPage.isShowAddress = true;
}

//显示地址编辑对话框
function showEditWindow(index){
	chooseAddress.showTwoBtnWindow(index);
}

function initOrder(){
	var url = window.location.href;
	var pos = url.indexOf("?");
	var paramUrl = decodeURIComponent(url.substr(pos+1,url.length));
	var params = paramUrl.split("|");
	var pId = "";
	var standard = "";
	var count;
	var price;
	for(var i=0;i < params.length;++i){
		var index = params[i].indexOf("=");
		var pa = params[i].split("=");
		if("pid" == pa[0]){
			pId = pa[1];
		}else if("standard" == pa[0]){
			standard = pa[1];
		}else if("count" == pa[0]){
			count = pa[1];
		}else if("price" == pa[0]){
			price = pa[1];
		}
	}
	initProduct(pId,standard,count,price);
	initAddress(1);
}

function initProduct(pId,standard,count,price){
	var data = {"pId": pId};
	$.ajax({
		type: "post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url: "http://localhost:8080/WXOfServer/product/detail",
		async: true,
		success: function(data){
			orderPage.initOrderMessage(data,standard,count,price);
		},
		error: function(){
			alert("服务器无响应");
		}
	});
}

function initAddress(uId){
	var data =  {"uId": uId};
	$.ajax({
		type: "post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url: "http://localhost:8080/WXOfServer/user/address",
		async: true,
		success: function(data){
			chooseAddress.initAddress(data);
		},
		error: function(){
			alert("服务器无响应");
		}
	});
}

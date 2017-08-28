$(function(){
	imgPath = "http://localhost/imageResource/";
	autoHeightTextaera();
	initOrderType();
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
		orderType: -1,
		isShowAddress: false,
		deliveCost: 0,
		productMessage: 
		{	
			pId: "",
			imgurl: "../img/20172001.jpg",
			imgname: "",
		    name: "change",
		    sId: -1,
		    standard: "4斤",
		    price: 299.90,
		    count: "1",
		    deliveryCost: 0.00,
		},
		productsMessage: [],
		addressMessage: 
		{
			id: "",
			name: "",
			tel: "",
			address: "",
			postcode: ""
		}
	},
	computed: {
		totalCost: function(){
			var price = 0;
			if(this.orderType == 0){
				price = parseFloat(this.productMessage.price) + parseFloat(this.productMessage.deliveryCost);
			}else if(this.orderType == 1){
				var len = this.productsMessage.length;
				for(var i=0;i < len;++i){
					var item = this.productsMessage[i];
					price += parseFloat(item.price);
				}
			}
			price += this.deliveCost;
			return price.toFixed(2);
		},
		pTotal: function(){
			var price = 0; 
			if(this.orderType == 0){
				price = parseFloat(this.productMessage.price) + parseFloat(this.productMessage.deliveryCost);
			}else if(this.orderType == 1){
				var len = this.productsMessage.length;
				for(var i=0;i < len;++i){
					var item = this.productsMessage[i];
					price += parseFloat(item.price);
				}
			}
			return price.toFixed(2);
		},
		deliveryCost: function(){
			var price = parseFloat(this.pTotal);
			if(price > 88){
				this.deliveCost = 0;
			}else{
				this.deliveCost = 6;
			}
			var cost = this.deliveCost; 
			return cost.toFixed(2);
		}
	},
	methods: {
		initOrderMessage: function(data,pId,sId,standard,count,price){
			this.productMessage.pId = pId;
			this.productMessage.name = data.product.name;
			this.productMessage.count = count;
			this.productMessage.sId = sId;
			this.productMessage.standard = standard;
			this.productMessage.price = (parseFloat(price) * count).toFixed(2);
			var images = data.images;
    		for(var i=0;i < images.length;++i){
    			if(images[i].image.startsWith("sImg")){
    				this.productMessage.imgname = images[i].image;
    				this.productMessage.imgurl = imgPath + images[i].image;
    				break;
    			}
    		}
		},
		submitOrder: function(){
			if(this.addressMessage.id == "" || this.addressMessage.name == "" || this.addressMessage.tel == "" || this.addressMessage.address == ""){
				tip.showDialog("请选择收货地址");
				return;
			}
			var data;
			var url;
			if(this.orderType == 0){
				url = "http://localhost:8080/WXOfServer/order/submit";
				data= {
					"uid":1,
					"pid":this.productMessage.pId,
					"sid":this.productMessage.sId,
					"pName":this.productMessage.name,
					"imgurl": this.productMessage.imgurl,
					"pTotal": this.productMessage.price,
					"count": this.productMessage.count,
					"standard": this.productMessage.standard,
					"sendCost": this.productMessage.deliveCost,
					"total": parseFloat(this.productMessage.price)+parseFloat(this.productMessage.deliveryCost),
					"discount": "1",
					"buyerMsg": $("#buy-message").val(),
					"sendWay": "快递发货",
					"aid": this.addressMessage.id,
					"receiver": this.addressMessage.name,
					"phone": this.addressMessage.tel,
					"address": this.addressMessage.address,
					"postcode": this.addressMessage.postcode
				};
			}else if(this.orderType == 1){
				url = "http://localhost:8080/WXOfServer/order/submit-multi";
				data = [];
				var len = this.productsMessage.length;
				var jsonStr = "{";
				if(len != 0){
					jsonStr += '"orders"' + ":" + "["
				}
				for(var i=0;i < len;++i){
					var key = "order"+i;
					var item = this.productsMessage[i];
					
					var value = "{"
								+ toJSONString("pId",item.pId)
								+ toJSONString("pno",item.pno)
								+ toJSONString("pname",item.pname) 
								+ toJSONString("sId",item.sId)
								+ toJSONString("standard",item.standard)
								+ toJSONString("imgname",item.imgname)
								+ toJSONString("imgurl",item.imgurl)
								+ toJSONString("price",item.price)
								+ toJSONString("count",item.count)
								+ toJSONStringWithOutSplit("total",item.total);
								
					if(i != len-1){
						value += "},";
					}else{
						value += "}";
					}
					jsonStr += value;
				}
				if(len != 0){
					jsonStr += "],";
				}
				var common = '"common"' + ":" + "{";
				common += toJSONString("uid",1)
					+ toJSONString("discount","1")
					+ toJSONString("sendWay", "快递发货")
					+ toJSONString("aid", this.addressMessage.id)
					+ toJSONString("receiver", this.addressMessage.name)
					+ toJSONString("phone", this.addressMessage.tel)
					+ toJSONString("address", this.addressMessage.address)
					+ toJSONStringWithOutSplit("postcode", this.addressMessage.postcode);
				common += "}";
				jsonStr += common;
				jsonStr += "}";
			}
			
			$.ajax({
				type: "post",
				dataType: "json",
				data: jsonStr,
				contentType: "application/json; charset=utf-8",
				url: url,
				async: true,
				success: function(data){
					tip.showDialog(data.message);
				},
				error: function(){
					alert("服务器无响应");
				}
			});
		}
	}
})

/*
 * 选择地址Vue组件popupwindow
 * */
var chooseAddressWindow = Vue.component("choose-address-window",{
	props: ['addressitem'],
	template: "#popup-window-address-choose",
	methods: {
		chooseAddressOfIndex: function(index){ //选择相应位置的地址
			orderPage.addressMessage.id = chooseAddress.addressItems[index].id;
			orderPage.addressMessage.name = chooseAddress.addressItems[index].name;
			orderPage.addressMessage.tel = chooseAddress.addressItems[index].tel;
			orderPage.addressMessage.address = chooseAddress.addressItems[index].address;
			orderPage.addressMessage.postcode = chooseAddress.addressItems[index].postcode;
			chooseAddress.isShowChooseWindow = false;
			orderPage.isShowAddress = true;
		},
		showEditWindow: function(index){ //显示地址编辑对话框
			chooseAddress.showTwoBtnWindow(index);
		}
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
				var addr = 
				{
					"id"      : address.id,
					"uid"     : address.uid,
					"name"    : address.receiver,
					"tel"     : address.phone,
					"province": address.province,
					"city"    : address.city,
					"region"  : address.region,
					"road"    : address.detailAddress,
					"address" : address.province+address.city+address.region+address.detailAddress,
					"postcode": address.postcode
				};
				this.addressItems.push(addr);
			}
			
		},
		saveAddress: function(){  //保存地址
			if(!this.checkAddress()){
				return;
			}
			var data = 
			{
				"id": this.addressRegion.id,
				"uid": 1,
				"receiver": this.addressRegion.name,
				"phone": this.addressRegion.tel,
			    "province": this.addressRegion.province,
			 	"city": this.addressRegion.city,
			 	"region": this.addressRegion.region,
				"detailAddress": this.addressRegion.road,
				"postcode": this.addressRegion.postcode
			};
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
		},
		choose: function(index){
			alert(index);
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

function initOrder(paramUrl){
	var params = paramUrl.split("|");
	var pId = "";
	var sId = "";
	var standard = "";
	var count;
	var price;
	for(var i=0;i < params.length;++i){
		var index = params[i].indexOf("=");
		var pa = params[i].split("=");
		if("pid" == pa[0]){
			pId = pa[1];
		}else if("sid" == pa[0]){
			sId = pa[1];
		}else if("standard" == pa[0]){
			standard = pa[1];
		}else if("count" == pa[0]){
			count = pa[1];
		}else if("price" == pa[0]){
			price = pa[1];
		}
	}
	initProduct(pId,sId,standard,count,price);
	initAddress(1);
}

//初始化产品订单信息
function initProduct(pId,sId,standard,count,price){
	var data = {"pId": pId};
	$.ajax({
		type: "post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url: "http://localhost:8080/WXOfServer/product/detail",
		async: true,
		success: function(data){
			orderPage.initOrderMessage(data,pId,sId,standard,count,price);
		},
		error: function(){
			alert("服务器无响应");
		}
	});
}

//初始化用户地址
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

function gotoOrderList(){
	window.location.href = "order-list.html?tab=1";
}

function initShopCartOrder(){
	var count = $.cookie("orderCount");
	if(count == 0 || count == undefined){
		return;
	}
	for(var i=0;i < count;++i){
		var order = JSON.parse($.cookie("order"+i));
		var item = {
			"pId": order.pId,
			"pno": order.pno,
			"pname": order.pname,
			"sId": order.sId,
			"standard": order.standard,
			"imgname": order.imgname,
			"imgurl": order.imgurl,
			"price": order.price,
			"count": order.count,
			"total": order.price,
		};
		orderPage.productsMessage.push(item);
	}
	initAddress(1);
}

function initOrderType(){
	var url = window.location.href;
	var pos = url.indexOf("?");
	var paramUrl = decodeURIComponent(url.substr(pos+1,url.length));
	var params = paramUrl.split("|");
	var flag = params[0].split("=");
	if(flag[0] == "flag"){
		if(flag[1] == "multi"){
			orderPage.orderType = 1;
			initShopCartOrder();
		}else if(flag[1] == "single"){
			orderPage.orderType = 0;
			initOrder(paramUrl);
		}
	}else{
		alert("订单信息有误");
	}
}

function toJSONString(key,value){
	var json = '"' + key + '"' + ":" + '"' + value + '"' + ",";
	return json;
}

function toJSONStringWithOutSplit(key,value){
	var dd = '"' + key + '"' + ":" + '"' + value + '"';
	return dd;
}

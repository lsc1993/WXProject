/*
 * 订单页面Vue实例
 * */
var orderPage = new Vue({
	el: "#order-page",
	data: {
		orderType: -1,
		singleOrmulti: false,
		isShowAddress: false,
		deliveCost: 0,
		productMessage: 
		{	
			pId: "",
			imgurl: "../img/20172001.jpg",
			imgname: "",
		    name: "",
		    sId: -1,
		    standard: "",
		    price: 0.00,
		    count: "0",
		},
		productsMessage: [],
		orderParam:{
			orderId: "",
			status: ""
		},
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
				price = parseFloat(this.productMessage.price);
			}else if(this.orderType == 1){
				var len = this.productsMessage.length;
				for(var i=0;i < len;++i){
					var item = this.productsMessage[i];
					var count = item.count;
 					price += (parseFloat(item.price) * parseInt(count));
				}
			}
			price += this.deliveCost;
			return price.toFixed(2);
		},
		pTotal: function(){
			var price = 0; 
			if(this.orderType == 0){
				price = parseFloat(this.productMessage.price);
			}else if(this.orderType == 1){
				var len = this.productsMessage.length;
				for(var i=0;i < len;++i){
					var item = this.productsMessage[i];
					var count = item.count;
 					price += (parseFloat(item.price) * parseInt(count));
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
		payOrder: function(){
			if(this.addressMessage.id == "" || this.addressMessage.name == "" || this.addressMessage.tel == "" || this.addressMessage.address == ""){
				tip.showDialog("请选择收货地址");
				return;
			}
			var data;
			var userToken = $.cookie("user_token");
			if(this.orderType == 0){
				data = {
					"userToken": userToken,
					"total": 0.5,
					"body": this.productMessage.name
				};
			}else if(this.orderType == 1){
				data = {
					"userToken": userToken,
					"total": 0.5,
					"body": ""
				};
			}
			$.ajax({
				type: "post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				url: requestIP + "/WXOfServer/wxpay/order-pay",
				async: true,
				success: function(data){
					if (typeof WeixinJSBridge == "undefined"){
					   if( document.addEventListener ){
					       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
					   }else if (document.attachEvent){
					       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
					       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
					   }
					}else{
					   onBridgeReady(data);
					}
				},
				error: function(){
					alert("服务器无响应");
				}
			});
		},
		submitOrder: function(){ // 提交订单或者多订单
			var data;
			var url;
			var userToken = $.cookie("user_token");
			if(this.orderType == 0){
				url = requestIP + "/WXOfServer/order/submit";
				var jsonData= {
					"userToken": userToken,
					"orderId": this.orderParam.orderId,
					"pid": this.productMessage.pId,
					"sid": this.productMessage.sId,
					"pName": this.productMessage.name,
					"imgurl": this.productMessage.imgname,
					"pTotal": this.productMessage.price,
					"count": this.productMessage.count,
					"standard": this.productMessage.standard,
					"sendCost": this.deliveCost,
					"total": parseFloat(this.productMessage.price)+parseFloat(this.deliveCost),
					"discount": "1",
					"buyerMsg": $("#buy-message").val(),
					"sendWay": "快递发货",
					"status": this.orderParam.status,
					"aid": this.addressMessage.id,
					"receiver": this.addressMessage.name,
					"phone": this.addressMessage.tel,
					"address": this.addressMessage.address,
					"postcode": this.addressMessage.postcode
				};
				
				data = JSON.stringify(jsonData);
			}else if(this.orderType == 1){
				url = requestIP + "/WXOfServer/order/submit-multi";
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
				common += toJSONString("userToken",userToken)
					+ toJSONString("orderId", this.orderParam.orderId)
					+ toJSONString("discount","1")
					+ toJSONString("sendWay", "快递发货")
					+ toJSONString("buyMsg", $("#buy-message").val())
					+ toJSONString("sendCost", this.deliveCost)
					+ toJSONString("aid", this.addressMessage.id)
					+ toJSONString("receiver", this.addressMessage.name)
					+ toJSONString("phone", this.addressMessage.tel)
					+ toJSONString("address", this.addressMessage.address)
					+ toJSONString("status", this.orderParam.status)
					+ toJSONStringWithOutSplit("postcode", this.addressMessage.postcode);
				common += "}";
				jsonStr += common;
				jsonStr += "}";
				data = jsonStr;
			}
			$("#submit-order-btn").attr("disabled", true);
			$.ajax({
				type: "post",
				dataType: "json",
				data: data,
				contentType: "application/json; charset=utf-8",
				url: url,
				async: true,
				success: function(data){
					$("#submit-order-btn").attr("disabled", false);
					clearCookies();
					window.location.href = "success.html";
				},
				error: function(){
					$("#submit-order-btn").attr("disabled", false);
					alert("服务器无响应");
				}
			});
		}
	}
})

$(function(){
	domain = "http://www.hzfuyao.com";
	imgPath = domain + ":1993/ImageResource/";
	requestIP = domain;
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
			var len = data.address.length;
			if(len == 0){
				return;
			}
			this.addressItems.splice(0,this.addressItems.length);
			for(var i=0;i < len;++i){//初始化地址列表
				var address = data.address[i];
				var addr = 
				{
					"id"      : address.id,
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
			var userToken = $.cookie("user_token");
			var data = 
			{
				"id": this.addressRegion.id,
				"userToken": userToken,
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
				posturl = requestIP + "/WXOfServer/user/add-addr";
			}else{
				posturl = requestIP + "/WXOfServer/user/update-addr";
			}
			$("#address-save-btn").attr("disabled", true);
			$.ajax({
				type: "post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				url: posturl,
				async: true,
				success: function(data){
					$("#address-save-btn").attr("disabled", false);
					chooseAddress.removeEditWindow();
					initAddress();
					alert(data.message);
				},
				error: function(){
					$("#address-save-btn").attr("disabled", false);
					alert("服务器无响应");
				}
			});
		},
		deleteAddress: function(){  //更新地址信息
			var userToken = $.cookie("user_token");
			var data = {"id": this.addressRegion.id,
						"userToken": userToken,
						"receiver": this.addressRegion.name,
						"phone": this.addressRegion.tel,
			            "province": this.addressRegion.province,
			 			"city": this.addressRegion.city,
			 			"region": this.addressRegion.region,
						"detailAddress": this.addressRegion.road,
						"postcode": this.addressRegion.postcode};
			$("#address-del-btn").attr("disabled", true);
			$.ajax({
				type: "post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				url: requestIP + "/WXOfServer/user/del-addr",
				async: true,
				success: function(data){
					$("#address-del-btn").attr("disabled", false);
					chooseAddress.removeEditWindow();
					initAddress();
					alert(data.message);
					
				},
				error: function(){
					$("#address-del-btn").attr("disabled", false);
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
	initAddress();
}

//初始化产品订单信息
function initProduct(pId,sId,standard,count,price){
	var data = {"pId": pId};
	$.ajax({
		type: "post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url: requestIP + "/WXOfServer/product/detail",
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
function initAddress(){
	var userToken = $.cookie("user_token");
	var data =  {"userToken": userToken};
	$.ajax({
		type: "post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url: requestIP + "/WXOfServer/user/address",
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
	initAddress();
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
			orderPage.singleOrmulti = true;
			initShopCartOrder();
		}else if(flag[1] == "single"){
			orderPage.orderType = 0;
			orderPage.singleOrmulti = false;
			initOrder(paramUrl);
		}
	}else{
		alert("订单信息有误");
	}
}

function gotoShopCart(){
	window.location.href = "shop-cart.html";
}

function toJSONString(key,value){
	var json = '"' + key + '"' + ":" + '"' + value + '"' + ",";
	return json;
}

function toJSONStringWithOutSplit(key,value){
	var dd = '"' + key + '"' + ":" + '"' + value + '"';
	return dd;
}

function clearCookies(){
	var count = $.cookie("orderCount");
	for(var i=0;i < count;++i){
		var key = "order" + i;
		$.cookie(key, null, {path:"/"});
	}
	$.cookie("orderCount", null, {path:"/"});
}

function onBridgeReady(data){
	orderPage.orderParam.orderId = data.orderId;
    WeixinJSBridge.invoke(
    	'getBrandWCPayRequest', {
        "appId": data.appId,     //公众号名称，由商户传入     	
        "timeStamp": data.timeStamp, //时间戳，自1970年以来的秒数
        "nonceStr": data.nonceStr, //随机串     
        "package": data.package,     
        "signType": data.signType,         //微信签名方式：     
        "paySign": data.paySign //微信签名 
    	},
        function(res){
       		alert(res.err_msg + " " + res.err_code + " " + res.err_desc);
            if(res.err_msg == "get_brand_wcpay_request:ok"){
				orderPage.orderParam.status = "WAITSEND";
            	orderPage.submitOrder();
            }else if(res.err_msg == "get_brand_wcpay_request:fail"){
            	alert("调用微信支付失败");
            }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
            	alert("已取消支付");
            }
        }
    ); 
}
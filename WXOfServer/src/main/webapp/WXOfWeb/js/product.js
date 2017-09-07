$(function(){
	domain = "http://localhost";
	imgPath = domain + ":1993/ImageResource/";
	requestIP = domain;
	getProductDetail();
})

function getProductDetail() {
	var url = window.location.href;
	var index = url.indexOf("pId=");
	var param = url.substring(index+4,url.length);
	var data = {"pId": param};
	$.ajax({
		type: "post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url: requestIP + "/WXOfServer/product/detail",
		async: true,
		success: function(data){
			productPage.initProductMessage(data);
			popup.initProductStandard(data);
			addBrowseHistory(data);
		},
		error: function(){
			alert("服务器无响应");
		}
	});
}

var productPage = new Vue({
	el: "#product-page",
	data: {
		isShowDetail: true,  //显示产品详情
		isShowAppraise: false,  //显示评论详情
		isDetail: true,   //显示产品详情title
		isAppraise: false,  //显示评论详情title
		productMessage: {
			productId: "",
			name: "红茶二",
			price: "0.00",
			describe: "红茶二",
			delivery: "",
			saleVolume: 0
		},
		imgurls: [],
		imgturn: [],
		userappraise: [
		    {
		    	img: "../img/20172001.jpg",
		    	name: "liushuang",
		     	appraise: "好评",
		     	time: "2017-07-09 12:10:30",
		     	feedback: ""
		   },
		   {
		   		img: "../img/20172001.jpg",
		    	name: "liushuang",
		    	appraise: "好评",
		    	time: "2017-07-09 12:10:30",
		    	feedback: "drgftewartgfdfsfdsfdsdfgserrrrrrrrsdfgdfgregregedsgewfafsdfa"
		    }
		]
	},
    methods:{
    	addImage: function(){
    		this.imgturn.push({"img": "../img/20172001.jpg"});
    		this.imgturn.push({"img": "../img/20172001.jpg"});
    		this.imgturn.push({"img": "../img/20172001.jpg"});
    		setTimeout(function(){
    			$("#product-img-turn").swipeSlide();
    			alert("qqq");
    		}, 2000);
    		
    	},
    	registerTurn: function(){
    		//$("#product-img-turn").swipeSlide();
    	},
    	initProductMessage: function(data){
    		this.productMessage.productId = data.product.pId;
    		this.productMessage.name = data.product.name;
    		this.productMessage.price = data.product.price;
    		this.productMessage.describe = data.product.describe;
    		this.productMessage.delivery = "满88包邮";
    		this.productMessage.saleVolume = data.saleVolum.saleVolum;
    		
    		var images = data.images;
    		for(var i=0;i < images.length;++i){
    			if(images[i].image.startsWith("dImg")){
    				var imageurl = {img: imgPath + images[i].image};
    				this.imgurls.push(imageurl);
    			}
    		}
    	},
    	showSellerReturn: function(index){
    		if (this.userappraise[index].feedback == "" || this.userappraise[index].feedback.length == 0) {
    			return false;
    		} else {
    			return true;
    		}
    	},
    	showProductDetail: function(){
    		this.isShowDetail = true;  
    		this.isShowAppraise = false; 
    		this.isDetail = true;  
    		this.isAppraise = false;  
    	},
    	showProductAppraise: function(){
    		this.isShowDetail = false;
    		this.isShowAppraise = true;
    		this.isDetail = false;
    		this.isAppraise = true;
    	},
    	showPopupWindow: function(){
    		popup.showPopupWindow();
    	},
    	gotoShopCart: function(){
    		window.location.href = "shop-cart.html"; 
    	},
    	collectProduct: function(){  //收藏产品
    		var url = window.location.href;
			var index = url.indexOf("pId=");
			var param = url.substring(index+4,url.length);
			var userToken = $.cookie("user_token");
			var data = {"userToken": userToken, "pId": param};
			$.ajax({
				type: "post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				url: requestIP + "/WXOfServer/product/collection",
				async: true,
				success: function(data){
				},
				error: function(){
					alert("服务器无响应");
				}
			});
    	}
    }
})

var popupWindow = Vue.component("popup-window",{
	props:['productitem','projectimg'],
	template: "#popup-window-modal"
})

var popup = new Vue({
	el: "#popup-window-div",
	data:{
		isShow : false,
		productMessage: {
			id: "",
			productId: "20172648",
			imgurl: "../img/20172001.jpg",
			imgname: "",
		    name: "wow",
		    price: 299,
		    count: 1,
		    labels: []
		}
	},
	methods: {
		initProductStandard: function(data){
			this.productMessage.id = data.product.id;
			this.productMessage.productId = data.product.pId;
    		this.productMessage.name = data.product.name;
    		this.productMessage.count = 1;
    		this.productMessage.price = data.product.price;
    		
    		var standard = data.standard;
    		if(standard.length > 0){
    			//this.productMessage.price = standard[0].price;
    			for(var i=0;i < standard.length;++i){
    				var s = {id: standard[i].id,label: standard[i].standard,price: standard[i].price, isChoosed: false};
    				this.productMessage.labels.push(s);
    			}
    		}
    		var images = data.images;
    		for(var i=0;i < images.length;++i){
    			if(images[i].image.startsWith("sImg")){
    				var imageurl = imgPath + images[i].image;
    				this.productMessage.imgname = images[i].image;
    				this.productMessage.imgurls = imageurl;
    			}
    		}
		},
		showPopupWindow: function(){
			this.isShow = true;
		},
		dismiss: function(){
			this.isShow = false;
		},
		chooseLabel: function(index){
			var length = this.productMessage.labels.length;
			for(var i = 0;i < length;++i){
				if(i == index){
					this.productMessage.labels[i].isChoosed = true;
					var a=this.productMessage.labels[i];
					this.productMessage.labels.splice(i,1,a);
					this.productMessage.price = this.productMessage.labels[i].price;
				} else {
					this.productMessage.labels[i].isChoosed = false;
					var a=this.productMessage.labels[i];
					this.productMessage.labels.splice(i,1,a);
				}
			}	
		}
	}
})

var dialogTip = Vue.component("dialog-tip",{
	props: ['message'],
	template: "#dialog-modal"
})

var dialog = new Vue({
	el: "#dialog-div",
	data: {
		isShowDialog: false,
		message: "请选择产品规格"
	},
	methods: {
		dismiss: function(){
			this.isShowDialog = false;
		},
		showDialog: function(){
			this.isShowDialog = true;
		}
	}
})

function addCount(){
	if(popup.productMessage.count < 100){
		popup.productMessage.count++;
	} else {
		alert();
	}
	
}

function subCount(){
	if(popup.productMessage.count > 1){
		popup.productMessage.count--;
	}
}

function addShopCart(){
	var length = popup.productMessage.labels.length;
    var index = -1;
    var sid = -1;
    var pid = -1;
    var pno = "";
    var standard = "";
    var price = 0;
    var count = 0;
    var imgurl;
    var pname = "";
    for(var i = 0;i < length;++i){
    	if(popup.productMessage.labels[i].isChoosed){
    		index = i;
    		sid = popup.productMessage.labels[i].id;
    		standard = popup.productMessage.labels[i].label;
    		price = popup.productMessage.labels[i].price;
    	}
    }
    if(index == -1 || standard == ""){
  		dialog.showDialog();
  		return;
    }
    pid = popup.productMessage.id;
    pno = popup.productMessage.productId;
    count = popup.productMessage.count;
    imgurl = popup.productMessage.imgname;
    pname = popup.productMessage.name;
    var userToken = $.cookie("user_token");
    var data = {"userToken": userToken,"pId": pid,"pNo": pno,"sId": sid,"standard": standard,
    			"price": price,"count": count,"imgurl": imgurl,"pName": pname};
    $.ajax({
    	type: "post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url: requestIP + "/WXOfServer/product/shopcart",
		async: true,
		success: function(data){
			popup.dismiss();
			alert(data.message);
		},
		error: function(){
			alert("服务器无响应");
		}
    });
}

function buyNow(){
	var length = popup.productMessage.labels.length;
    var index = -1;
    var sid = -1;
    var standard = "";
    var price = 0;
    for(var i = 0;i < length;++i){
    	if(popup.productMessage.labels[i].isChoosed){
    		index = i;
    		sid = popup.productMessage.labels[i].id;
    		standard = popup.productMessage.labels[i].label;
    		price = popup.productMessage.labels[i].price;
    	}
    }
    if(index == -1 || standard == "" || sid == -1){
  		dialog.showDialog();
    }else{
    	var url = "order.html?"; 
    	var param = "flag=single"
    	+ "|pid=" + popup.productMessage.productId
    	+ "|count=" + popup.productMessage.count
    	+ "|sid=" + sid
    	+ "|standard=" + standard
    	+ "|price=" + price;
    	var encodeParam = encodeURIComponent(param);
    	window.location.href = url + encodeParam;
    }
}

function addBrowseHistory(data){
	var images = data.images;
	var imgname;
    for(var i=0;i < images.length;++i){
    	if(images[i].image.startsWith("sImg")){
    		imgname = images[i].image;
    	}
    }
    var userToken = $.cookie("user_token");
	var data = {
		"userToken": userToken,
		"pId": data.product.id,
		"pno": data.product.pId,
		"price": data.product.price,
		"pname": data.product.name,
		"imgurl": imgname
	};
	
	$.ajax({
		type: "post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url: requestIP + "/WXOfServer/product/browse",
		async: true,
		success: function(data){
			//alert(data.message);
		},
		error: function(){
			alert("服务器无响应");
		}
	});
}

$(function(){
	imgPath = "http://localhost/imageResource/";
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
		url: "http://localhost:8080/WXOfServer/product/detail",
		async: true,
		success: function(data){
			productPage.initProductMessage(data);
			popup.initProductStandard(data);
		},
		error: function(){
			alert("服务器无响应");
		}
	});
}

var productPage = new Vue({
	el: "#product-page",
	data: {
		isShowDetail: true,
		isShowAppraise: false,
		isDetail: true,
		isAppraise: false,
		productMessage: {
			productId: "20172648",
			name: "ddd",
			price: "199.00",
			describe: "发文件哦忘记佛我",
			delivery: "免运费",
			saleVolume: 668
		},
		imgurls: [
		    /*{img : "../img/20172001.jpg"},
		    {img : "../img/20172001.jpg"},
		    {img : "../img/20172001.jpg"}*/
		],
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
    	initProductMessage: function(data){
    		this.productMessage.productId = data.product.pId;
    		this.productMessage.name = data.product.name;
    		this.productMessage.price = data.product.price;
    		this.productMessage.describe = data.product.describe;
    		this.productMessage.delivery = "免运费";
    		this.productMessage.saleVolume = data.saleVolum.saleVolum;
    		
    		var images = data.images;
    		for(var i=0;i < images.length;++i){
    			if(images[i].image.startsWith("dImg")){
    				var imageurl = {img: imgPath + images[i].image};
    				//alert(imageurl.img);
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
    	collectProduct: function(){
    		var url = window.location.href;
			var index = url.indexOf("pId=");
			var param = url.substring(index+4,url.length);
			var data = {"uId": 1, "pId": param};
			$.ajax({
				type: "post",
				dataType: "json",
				data: JSON.stringify(data),
				contentType: "application/json; charset=utf-8",
				url: "http://localhost:8080/WXOfServer/product/collection",
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
			imgurl: "../img/20172001.jpg",
			productId: "20172648",
		    name: "wow",
		    price: 299,
		    count: 1,
		    labels: [
		        /*{label: "weqwdqwdrtyrtqwdq", isChoosed: false},
		        {label: "qweqwqweqyerte", isChoosed: false},
		        {label: "dasfdwqeftryrty", isChoosed: false}*/
		    ]
		}
	},
	methods: {
		initProductStandard: function(data){
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
    var standard = "";
    for(var i = 0;i < length;++i){
    	if(popup.productMessage.labels[i].isChoosed){
    		index = i;
    		standard = popup.productMessage.labels[i].label;
    	}
    }
    if(index == -1 || standard == ""){
  		dialog.showDialog();
    }
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
    	var param = "pid=" + popup.productMessage.productId
    	+ "|count=" + popup.productMessage.count
    	+ "|sid=" + sid
    	+ "|standard=" + standard
    	+ "|price=" + price;
    	var encodeParam = encodeURIComponent(param);
    	window.location.href = url + encodeParam;
    }
}
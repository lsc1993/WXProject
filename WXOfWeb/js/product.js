$(function(){
	//getParam();
})

function getParam() {
	var url = window.location.href;
	var index = url.indexOf("pid=");
	var param = url.substring(index+4,url.length);
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
		    {imgurl : "../img/20172001.jpg"},
		    {imgurl : "../img/20172001.jpg"},
		    {imgurl : "../img/20172001.jpg"}
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
    	gotoShopCart: function() {
    		window.location.href = "shop-cart.html"; 
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
		    price: "299",
		    count: 1,
		    labels: [
		        {label: "weqwdqwdrtyrtqwdq", isChoosed: false},
		        {label: "qweqwqweqyerte", isChoosed: false},
		        {label: "dasfdwqeftryrty", isChoosed: false}
		    ]
		}
	},
	methods: {
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
					this.productMessage.labels.splice(i,1,a)
				} else {
					this.productMessage.labels[i].isChoosed = false;
					var a=this.productMessage.labels[i];
					this.productMessage.labels.splice(i,1,a)
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
    var standard = "";
    for(var i = 0;i < length;++i){
    	if(popup.productMessage.labels[i].isChoosed){
    		index = i;
    		standard = popup.productMessage.labels[i].label;
    	}
    }
    if(index == -1 || standard == ""){
  		dialog.showDialog();
    }else{
    	var url = "order.html?"; 
    	var param = "pid=" + popup.productMessage.productId
    	+ "|count=" + popup.productMessage.count
    	+ "|standard=" + standard;
    	var encodeParam = window.btoa(param);
    	window.location.href = url + encodeParam;
    }
}

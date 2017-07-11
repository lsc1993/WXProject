$(function(){
	//getParam();
	//initImgSlider();
	//$('#product-img-slider').unslider();
})

function getParam() {
	var url = window.location.href;
	var index = url.indexOf("pid=");
	var param = url.substring(index+4,url.length);
	alert(param);
}

function productDetailTabClick(index) {
	$("#product-detaile-title").toggleClass("product-tab-title-bottom-line");
	$("#product-appraise-title").toggleClass("product-tab-title-bottom-line");
	if (index == 1) {
		$("#product-detail").show();
		$("#product-appraise").hide();
	} else if (index == 2) {
		$("#product-detail").hide();
		$("#product-appraise").show();
	}
}

function initImgSlider() {
	var list = [
	    {content: '../img/20172001.jpg'},
	    {content: '../img/20172001.jpg'},
	    {content: '../img/20172001.jpg'},
	    {content: '../img/20172001.jpg'}
	];
	new iSlider(document.getElementById('product-img-slider'),list,{
        isAutoplay: 1,
        isLooping: 1,
        isOverspread: 1,
        animateTime: 800
    });
}

var productDetali = new Vue({
	el: "#product-detail",
	data:{
		imgurls:[
		    {imgurl : "../img/20172001.jpg"},
		    {imgurl : "../img/20172001.jpg"},
		    {imgurl : "../img/20172001.jpg"}
		]
	}
})

var productAppraise = new Vue({
	el: "#product-appraise",
	data:{
		isShowReturn : false,
		userappraise:[
		    {userimg: "../img/20172001.jpg",
		     username: "liushuang",
		     userappraise: "好评",
		     time: "2017-07-09 12:10:30",
		     sellerreturn: "drgftewartgfdfsfdsfdsdfgserrrrrrrrsdfgdfgregregedsgewfafsdfa"
		   },
		   {userimg: "../img/20172001.jpg",
		     username: "liushuang",
		     userappraise: "好评",
		     time: "2017-07-09 12:10:30",
		     sellerreturn: "drgftewartgfdfsfdsfdsdfgserrrrrrrrsdfgdfgregregedsgewfafsdfa"
		    }
		]
	},
    methods:{
    	showSellerReturn: function(){
    		if (this.userappraise[0].sellerreturn == "" || this.userappraise[0].sellerreturn.length == 0) {
    			this.isShowReturn = false;
    		} else {
    			this.isShowReturn = true;
    		}
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
		productMessage:[
		    {imgurl: "../img/20172001.jpg",
		     name: "wow",
		     price: "299",
		     labels: [
		         {label : "weqwdqwdrtyrtqwdq"},
		         {label : "qweqwqweqyerte"},
		         {label : "dasfdwqeftryrty"}
		         ]
		    }
		]
	},
	methods: {
		showPopupWindow: function(){
			this.isShow = true;
		},
		dismiss: function(){
			this.isShow = false;
		}
	}
})

function showPopupWindow() {
	popup.showPopupWindow();
}

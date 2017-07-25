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
		    name: "wow",
		    price: "299",
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
		}
	}
})

function chooseLabel(index){
	var length = popup.productMessage.labels.length;
	for(var i = 0;i < length;++i){
		if(i == index){
			popup.productMessage.labels[i].isChoosed = true;
			var a=popup.productMessage.labels[i];
			popup.productMessage.labels.splice(i,1,a)
		} else {
			popup.productMessage.labels[i].isChoosed = false;
			var a=popup.productMessage.labels[i];
			popup.productMessage.labels.splice(i,1,a)
		}
	}	
}

$(function(){
	//getParam();
})

function getParam() {
	var url = window.location.href;
	var index = url.indexOf("pid=");
	var param = url.substring(index+4,url.length);
	alert(param);
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
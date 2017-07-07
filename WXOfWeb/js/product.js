$(function(){
	//getParam();
})

function getParam() {
	var url = window.location.href;
	var index = url.indexOf("pid=");
	var param = url.substring(index+4,url.length);
	alert(param);
}

var popupWindow = Vue.component("popup-window",{
	props:['productitem'],
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
		     labels: ["weqwdqwdqwdq","qweqwqweqe","dasfdwqef"]
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
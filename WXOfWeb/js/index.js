$(function(){
	
})

function tabClick(index) {
	if (index == 1) {
		$("#tab-1").addClass("tab-choosed").siblings().removeClass("tab-choosed");
	} else if(index == 2) {
		$("#tab-2").addClass("tab-choosed").siblings().removeClass("tab-choosed");
	} else if(index == 3) {
		$("#tab-3").addClass("tab-choosed").siblings().removeClass("tab-choosed");
	} else if(index == 4) {
		$("#tab-4").addClass("tab-choosed").siblings().removeClass("tab-choosed");
	}
}

var productWrapper = new Vue({
	el: "#product-wrapper",
	data: {
		items: [
		    {img: "../img/20172001.jpg"},
		    {img: "../img/20172001.jpg"}
		]
	}
})

Vue.component("product-li",{
	template: '<li><a><img src="{{imgUrl}}"></a></li>',
	props:['imgUrl']
})
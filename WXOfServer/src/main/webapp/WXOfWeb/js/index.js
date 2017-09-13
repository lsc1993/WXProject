$(function(){
	domain = "http://localhost";
	imgPath = domain + ":1993/ImageResource/";
	requestIP = domain+":8080";
	start = 0;
	times = 0;
	dropUpLoad();
	var url = window.location.href;
	//var str = url.split("?");
	var code = "weixin";
	/*if(str.length > 1){
		var params = str[1].split("&");
		var p = params[0].split("=");
		code = p[1]; 
		if(code != "" && code != undefined){
			authWXUser(code);
		}
	}*/
	authWXUser(code);
})

/*
 * 产品展示列表Vue实例
 * */
var productWrapper = new Vue({
	el:"#product-wrapper",
	data: {
		products: []
	},
	methods: {
		gotoProduct: function(index){
			window.location.href = "product.html?pId="+this.products[index].productId;
		}
	}
})

function getIndexProduct(me){
	var data = {"start": start,"limit": 8};
	$.ajax({
		type:"post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		//url:"http://localhost:8080/WXOfServer/product/list",
		url: requestIP + "/WXOfServer/product/list",
		async:true,
		success: function(data){
			start++;
			if(data.size > 0){
				var length = data.rows.length;
				var p = data.rows;
				for(var i = 0;i < length;++i){
					var pp = new Array();
					pp["img"] = imgPath + p[i].image.image;
					pp["productId"] = p[i].product.pId;
					productWrapper.products.push(pp);
				}
			} else {
				me.lock();
				me.noData();
			}
			me.resetload();
		},
		error: function(){
			times++;
			if(times == 5){
				alert("服务器无响应");
				$('.dropload-down').hide();
			} else if(times < 5){
				me.resetload(); 
			}
		}
	});
}

function dropUpLoad(){
	var dropload = $("#product-wrapper").dropload({
		scrollArea : window,
        domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData">没有更多了</div>'
        },
        loadDownFn : function(me){
        	getIndexProduct(me);
        }
    });
}

function authWXUser(code){
	var data = new FormData();
	data.append("code", code);
	$.ajax({
		type: "post",
		data: data,
		processData: false,
		url: requestIP + "/WXOfServer/wxauth/auth",
		contentType: false,
		cache: false,
		async: true,
		success: function(data){
			window.history.pushState(null, null, "index.html");
			if(data.result == "fault"){
				alert(data.message);
			}
		},
		error: function(){
			//alert("服务器无响应");
		}
	});
}

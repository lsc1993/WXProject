$(function(){
	imgUrl = "http://localhost/imageResource/";
	start = 0;
	times = 0;
	dropUpLoad();
})

/*
 * 产品展示列表Vue实例
 * */
var productWrapper = new Vue({
	el:"#product-wrapper",
	data: {
		products: [
		    /*{img : "../img/20172001.jpg", productId : 20172001},
		    {img : "../img/20172001.jpg", productId : 20172001},
		    {img : "../img/20172001.jpg", productId : 20172001},
		    {img : "../img/20172001.jpg", productId : 20172001},
		    {img : "../img/20172001.jpg", productId : 20172001},*/
		]
	}
})

function getIndexProduct(me){
	var data = {"start": start,"limit": 1};
	$.ajax({
		type:"post",
		dataType: "json",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		url:"http://localhost:8080/WXOfServer/product/list",
		async:true,
		success: function(data){
			start++;
			if(data.size > 0){
				var length = data.rows.length;
				var p = data.rows;
				for(var i = 0;i < length;++i){
					var pp = new Array();
					pp["img"] = imgUrl + p[i].image.image;
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
            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData">暂无数据</div>'
        },
        loadDownFn : function(me){
        	getIndexProduct(me);
        }
    });
}

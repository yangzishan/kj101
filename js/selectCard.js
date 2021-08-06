$('.my_view').css("display","none");
$('.load-overlay').css("display","block");

var reportId=getQueryString("reportId");
var reportType=getQueryString("reportType");
var packageId=getQueryString("packageId");
var userId=getQueryString("userId");
var openId=getQueryString("openId");
var saasId=getQueryString("saasId");
var relationUrl=(getQueryString("relationUrl") || '');

/*var myapp = new Vue({
	el: '#appVUE',
	data: function(){
		return {
			cards:[],
			userId:userId,
			reportId:reportId,
			openId:openId,
			reportType:reportType,
			packageId:packageId,
			saasId:saasId
			
		}
	},
	mounted: function(){
		
	},
	methods:{
		findUserCards: function(){
			var vm = this
			$.ajax({
				url : dataUrl + "/api/v1/cardPay/findUserCards",
				type : "POST",
				dataType : 'json',
				data : {
				   	userId : userId,
				   	reportId: reportId,
				   	openId: openId
				},
				success : function(data) {
					//alert('get it');
					if(data.code == 200){
						$('.my_view').css("display","block");
						$('.load-overlay').css("display","none");
						vm.cards: data.data.List
					}else{
						alert('code='+ data.code)
					}
				},
				error : function(obj,msg){console.log('findUserCards error')}
			});
		}
	}
})*/

$.ajax({
	url : dataUrl + "/api/v1/cardPay/findUserCards",
	type : "POST",
	dataType : 'json',
	data : {
	   	userId : userId,
	   	reportId: reportId,
	   	openId: openId
	},
	success : function(data) {
		//alert('get it');
		if(data.code == 200){
			$('.my_view').css("display","block");
			$('.load-overlay').css("display","none");
			var myApp = new Vue({
			  	el: '#appVUE',
			  	data: {
			    	cards: data.data.List
			  	}			  
			});
			//遍历卡 设置格式
			$('.g-tyk').each(function(){
				var dateStr1 = $(this).find('.sxDate').text();
				var dateStr2 = dateStr1.substring(0,10);
				$(this).find('.sxDate').text(dateStr2);
			});
			
			//隐藏卡号加选中样式
			$('.g-tyk .tyk_x .tnum span').each(function(){
				var str = $(this).text();
				var reg = /^(\d{4})\d+(\d{4})$/;
				$(this).text(str.replace(reg, "$1********$2"));
			});
			$('.g-tyk').on("click",function(){
				$(this).addClass('on').siblings().removeClass('on');
			});
			
			$('#goPay').on("click",function(){
				var mywordNum = $('.g-tyk.on .tyk_x .kaNo').val();
				if(mywordNum == '' || mywordNum == undefined || mywordNum == null){
					alert('请选择要支付的卡');
				}else{
					$(this).attr("disabled",true);
					$.ajax({
						url : dataUrl + "/api/v1/cardPay/updateWordPay",
						type : "POST",
						dataType : 'json',
						data : {
						   	reportId : reportId,
						    packageId : packageId,
							userId : userId,
							wordNum: mywordNum,
							batchType: 20,
							saasId: saasId,
							openId:openId
						},
						success : function(resultData){
							if(resultData.code == 200){
								if(resultData.data == "0" || resultData.data == "true"){
									zhuge.track('支付成功', { //埋点t
										'方式': '卡支付'
									},function(){
										//azySendReportSaas() 改后台去调用
										
										if(relationUrl){
											location.href = "relationUrl.html?relationUrl="+relationUrl
										}else{
											location.href = "common.html?reportId="+reportId+'&openId='+openId+'&customerId='+userId+'&reportType='+reportType+'&saasId='+saasId
										}

									});	
								}else{
									setTimeout(function(){$('#goPay').attr("disabled",false)},500);
									zhuge.track('支付失败',{
										'方式': '卡支付',
										'原因': checkMsg(resultData.data)
									});
									alert(checkMsg(resultData.data));
								}
							}else if(resultData.code == 300){
								setTimeout(function(){$('#goPay').attr("disabled",false)},500);
								alert('支付失败 请重试');
							}else{
								alert('code=' + resultData.code);
							}
	
						},
						error : function(obj,msg){
							//alert('支付接口调用失败');
						}
						
					});
				}
	
			});
			
		}else{
			alert('code='+ data.code)
		}
	},
	error : function(obj,msg){console.log('findUserCards error')}
});

function azySendReportSaas(){
	$.ajax({
		type:"post",
		url:dataUrl+"/weiXin/azySendReportSaas",
		dataType:'Json',
		data:{
			saasId:saasId,
			reportId: reportId
		},
		success: function(res){
			if(res.code == "200"){
				console.log('success')
			}
		},
		error: function(){console.log('azySendReportSaas error')}
	});
	
};


$.ajax({ //判断是否已经支付，若支付就跳转报告
	url : dataUrl + "/api/v1/reportWxPay/findPackage",
    type : "POST",
	dataType : 'json',
	data : {
	    reportId : reportId, 
	    openId : openId
	},
	success: function(data){
		if(data.code == 200){
			if(relationUrl){
				location.href = "relationUrl.html?relationUrl="+relationUrl
			}else{
				if(reportType == 121 || reportType == 122 || reportType == 123 || reportType == 12001){
					location.href='report120.html?reportId='+reportId+'&userId='+userId+'&reportType='+reportType+'&openId='+openId+'&saasId='+saasId
				}else if(reportType == 501 || reportType == 502 || reportType == 5021 || reportType == 505 || reportType == 503){
					location.href='report500.html?reportId='+reportId+'&userId='+userId+'&reportType='+reportType+'&openId='+openId+'&saasId='+saasId
				}else{
					location.href='report'+reportType+'.html?reportId='+reportId+'&userId='+userId+'&reportType='+reportType+'&openId='+openId+'&saasId='+saasId
				}
			}
		}
	}
});

//截取URL
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};